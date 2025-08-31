# 🚀 Complete API CURL Guide & Standard Operating Procedures

## 📋 Table of Contents
1. [System Overview & API Logic](#system-overview--api-logic)
2. [Authentication Flow](#authentication-flow)
3. [Lead Management Flow](#lead-management-flow)
4. [Supporting Services](#supporting-services)
5. [Complete CURL Commands](#complete-curl-commands)
6. [Standard Operating Procedures (SOP)](#standard-operating-procedures-sop)
7. [Error Handling & Troubleshooting](#error-handling--troubleshooting)
8. [Production Deployment Guide](#production-deployment-guide)

---

## 🏗️ System Overview & API Logic

### **Core API Architecture**
```
┌─────────────────────────────────────────────────────────────────┐
│                    LOAN GENIUS API FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Partner Authentication                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /partner/token                                     │   │
│  │ → Generate JWT Partner Token                            │   │
│  │ → Cache token until expiry                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  Step 2: User Authentication                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /partner/auth (Send OTP)                           │   │
│  │ → Send mobile number                                    │   │
│  │ → Receive epoch token                                   │   │
│  │                                                         │   │
│  │ POST /partner/auth (Verify OTP)                         │   │
│  │ → Send OTP with epoch token                             │   │
│  │ → Receive user auth token                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  Step 3: Lead Management                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /loangenius/lead-details (Initial)                 │   │
│  │ → Create lead with generateExit=true                    │   │
│  │ → Receive lead_id and exit_id                           │   │
│  │                                                         │   │
│  │ POST /loangenius/lead-details (Complete)                │   │
│  │ → Submit complete user data                             │   │
│  │ → Receive loan offers (eligible & ineligible)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  Step 4: Supporting Services (Parallel)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ GET /companies/{query} → Company autocomplete           │   │
│  │ GET /pincode/{pincode} → Location validation           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **API Endpoints Summary**
| Endpoint | Method | Purpose | Authentication |
|----------|---------|---------|----------------|
| `/partner/token` | POST | Generate partner JWT | API Key |
| `/partner/auth` | POST | Send/Verify OTP | Partner Token |
| `/loangenius/lead-details` | POST | Lead management | Partner Token + User Token |
| `/companies/{query}` | GET | Company search | None |
| `/pincode/{pincode}` | GET | Location validation | None |

---

## 🔐 Authentication Flow

### **Phase 1: Partner Token Generation**

#### **API Logic**
```
Purpose: Generate JWT token for partner authentication
Duration: Valid for ~24 hours
Caching: Token cached until expiry to reduce API calls
```

#### **CURL Command**
```bash
curl -X POST 'https://uat-platform.bankkaro.com/partner/token' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "x-api-key": "test"
  }'
```

#### **Expected Response**
```json
{
  "status": "success",
  "message": "Token generated successfully",
  "data": {
    "jwttoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyIjoiYmFua2thcm8iLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MTcwNDE1MzYwMH0.xyz123",
    "expiresAt": "2024-01-02T12:00:00.000Z"
  }
}
```

### **Phase 2: User Authentication - Send OTP**

#### **API Logic**
```
Purpose: Send OTP to user's mobile number
Returns: Epoch token for OTP verification
Expiry: OTP valid for 5 minutes
```

#### **CURL Command**
```bash
curl -X POST 'https://uat-platform.bankkaro.com/partner/auth' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'partner-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -d '{
    "mobile": "9058010369"
  }'
```

#### **Expected Response**
```json
{
  "status": "success",
  "message": "OTP sent successfully",
  "data": {
    "token": "epoch_1704067200_abc123",
    "newUser": true
  }
}
```

### **Phase 3: User Authentication - Verify OTP**

#### **API Logic**
```
Purpose: Verify OTP and get user authentication token
Returns: User auth token + user data
Session: Token valid for current session
```

#### **CURL Command**
```bash
curl -X POST 'https://uat-platform.bankkaro.com/partner/auth' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'partner-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'x-epoch: epoch_1704067200_abc123' \
  -d '{
    "mobile": "9058010369",
    "otp": "666866"
  }'
```

#### **Expected Response**
```json
{
  "status": "success",
  "message": "OTP verified successfully",
  "data": {
    "token": "user_auth_token_xyz789",
    "partner": "bankkaro",
    "message": "Authentication successful",
    "user_data": {
      "status": "success",
      "message": "User data retrieved",
      "data": {
        "user_data": {
          "user_id": "12345",
          "mobile": "9058010369",
          "first_name": "John",
          "last_name": "Doe",
          "email": "john.doe@example.com"
        },
        "spendingHabits": [],
        "tag_genius_data": []
      }
    }
  }
}
```

---

## 📝 Lead Management Flow

### **Phase 1: Initial Lead Creation**

#### **API Logic**
```
Purpose: Initialize lead and get lead_id + exit_id
Required: User must be authenticated
Returns: Lead identifiers for subsequent calls
```

#### **CURL Command**
```bash
curl -X POST 'https://uat-platform.bankkaro.com/partner/loangenius/lead-details' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'partner-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Authorization: user_auth_token_xyz789' \
  -d '{
    "leadType": "PL",
    "payload": {
      "generateExit": true
    }
  }'
```

#### **Expected Response**
```json
{
  "status": "success",
  "message": "Lead created successfully",
  "data": {
    "success": 1,
    "message": "Lead initialized",
    "lead_id": "LEAD_67890",
    "exit_id": "EXIT_12345",
    "vendor": "bankkaro"
  }
}
```

### **Phase 2: Complete Lead Submission**

#### **API Logic**
```
Purpose: Submit complete user data and get loan offers
Process: Data validation → Credit check → Lender matching → Offer generation
Returns: Eligible and ineligible loan offers with detailed information
```

#### **Complete CURL Command with All Data**
```bash
curl -X POST 'https://uat-platform.bankkaro.com/partner/loangenius/lead-details' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'partner-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Authorization: user_auth_token_xyz789' \
  -d '{
    "leadType": "PL",
    "payload": {
      "lead_id": "LEAD_67890",
      "exit_id": "EXIT_12345",
      "vendor": "bankkaro",
      "breFlag": true,
      "generateExit": true,
      
      // Personal Information
      "first_name": "John",
      "last_name": "Doe",
      "gender": "male",
      "dob": "1990-01-15",
      "pan": "ABCDE1234F",
      "email": "john.doe@example.com",
      
      // Loan Requirements
      "loan_amount_required": "500000",
      "already_existing_credit": false,
      
      // Employment Details
      "employmentStatus": "salaried_employee",
      "company_name": "Tech Corp India Private Limited",
      "inhandIncome": "75000",
      "salary_recieved_in": "bank_transfer",
      
      // Location Details
      "pincode": "110001",
      "office_pincode": "110002",
      "city": "New Delhi",
      "state": "Delhi",
      
      // Credit Information (Defaults)
      "fetch_credit_consent": true,
      "know_your_credit_score": true,
      "credit_range": "750",
      "total_emis": 2
    }
  }'
```

#### **Expected Response Structure**
```json
{
  "status": "success",
  "message": "Lead processed successfully",
  "data": {
    "success": 1,
    "message": "Loan offers generated",
    "isEligible": [
      {
        "lender_id": 1,
        "offer_id": 12345,
        "lender_name": "HDFC Bank",
        "lender_image": "https://example.com/hdfc-logo.png",
        "lender_category": "Banks",
        "loan_offered_upto": "1000000",
        "minimum_interest_rate": "10.5",
        "maximum_interest_rate": "15.5",
        "maximum_loan_tenure": "60",
        "max_loan_allowed": "1000000",
        "processing_fee": "2.5",
        "monthly_installment": "9560",
        "total_payable_amount": "573600",
        "minimum_total_interest_paid": "73600",
        "maximum_total_interest_paid": "156000",
        "documentation": ["PAN Card", "Salary Slips", "Bank Statements"],
        "features": ["Quick Processing", "No Collateral", "Flexible EMI"],
        "apply_url": "https://apply.hdfc.com/loan/12345",
        "loan_tags": [
          {"id": 1, "name": "Quick Approval"},
          {"id": 2, "name": "Low Interest"}
        ]
      },
      {
        "lender_id": 2,
        "offer_id": 12346,
        "lender_name": "SBI",
        "lender_image": "https://example.com/sbi-logo.png",
        "lender_category": "Banks",
        "loan_offered_upto": "800000",
        "minimum_interest_rate": "11.0",
        "maximum_interest_rate": "16.0",
        "maximum_loan_tenure": "48",
        "processing_fee": "1.5",
        "monthly_installment": "8750",
        "total_payable_amount": "420000",
        "apply_url": "https://apply.sbi.com/loan/12346"
      }
    ],
    "inEligibleOffers": [
      {
        "lender_id": 3,
        "lender_name": "ICICI Bank",
        "lender_image": "https://example.com/icici-logo.png",
        "lender_category": "Banks",
        "rejectedReason": "Minimum salary requirement not met",
        "salaryRejected": true,
        "minimum_interest_rate": "12.0",
        "maximum_interest_rate": "18.0"
      },
      {
        "lender_id": 4,
        "lender_name": "Axis Bank",
        "rejectedReason": "Service not available in your location",
        "pincodeReject": true
      }
    ],
    "lead_info": {
      "lead_id": "LEAD_67890",
      "exit_id": "EXIT_12345",
      "status": "processed",
      "created_at": "2024-01-01T12:00:00.000Z"
    },
    "user_info": {
      "credit_score": 750,
      "eligibility_status": "approved",
      "total_offers": 4,
      "eligible_offers": 2
    }
  }
}
```

---

## 🔍 Supporting Services

### **Company Search API**

#### **API Logic**
```
Purpose: Autocomplete company names for employment verification
Search: Fuzzy matching on company names
Returns: List of verified companies with IDs
```

#### **CURL Command**
```bash
curl -X GET 'https://bk-api.bankkaro.com/sp/api/companies/tech%20corp?type=PL' \
  -H 'Accept: application/json'
```

#### **Expected Response**
```json
{
  "status": "success",
  "message": "Companies found",
  "data": [
    {
      "id": 1,
      "companyName": "Tech Corp India Private Limited",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "status": 1
    },
    {
      "id": 2,
      "companyName": "Tech Corporation Ltd",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "status": 1
    }
  ]
}
```

### **Pincode Validation API**

#### **API Logic**
```
Purpose: Validate pincode and auto-populate city/state
Validation: Check if pincode is serviceable
Returns: Location details with city and state
```

#### **CURL Command**
```bash
curl -X GET 'https://bk-api.bankkaro.com/sp/api/pincode/110001?type=PL' \
  -H 'Accept: application/json'
```

#### **Expected Response**
```json
{
  "status": "success",
  "message": "Pincode details found",
  "data": [
    {
      "id": 1,
      "lender_id": 1,
      "pincode": "110001",
      "city": "New Delhi",
      "state": "Delhi",
      "category": "Metro",
      "status": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 📚 Standard Operating Procedures (SOP)

### **SOP 1: Complete User Onboarding Flow**

#### **Step 1: Initialize System**
```bash
# 1.1 Generate Partner Token
curl -X POST 'https://uat-platform.bankkaro.com/partner/token' \
  -H 'Content-Type: application/json' \
  -d '{"x-api-key": "test"}'

# Store the JWT token from response for subsequent calls
export PARTNER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### **Step 2: User Authentication**
```bash
# 2.1 Send OTP
curl -X POST 'https://uat-platform.bankkaro.com/partner/auth' \
  -H 'Content-Type: application/json' \
  -H "partner-token: $PARTNER_TOKEN" \
  -d '{"mobile": "9058010369"}'

# Store epoch token from response
export EPOCH_TOKEN="epoch_1704067200_abc123"

# 2.2 Verify OTP
curl -X POST 'https://uat-platform.bankkaro.com/partner/auth' \
  -H 'Content-Type: application/json' \
  -H "partner-token: $PARTNER_TOKEN" \
  -H "x-epoch: $EPOCH_TOKEN" \
  -d '{
    "mobile": "9058010369",
    "otp": "666866"
  }'

# Store user auth token from response
export USER_TOKEN="user_auth_token_xyz789"
```

#### **Step 3: Data Collection & Enhancement**
```bash
# 3.1 Search Company (Optional - for autocomplete)
curl -X GET 'https://bk-api.bankkaro.com/sp/api/companies/tech%20corp?type=PL'

# 3.2 Validate Pincode (Optional - for location auto-fill)
curl -X GET 'https://bk-api.bankkaro.com/sp/api/pincode/110001?type=PL'
```

#### **Step 4: Lead Processing**
```bash
# 4.1 Initialize Lead
curl -X POST 'https://uat-platform.bankkaro.com/partner/loangenius/lead-details' \
  -H 'Content-Type: application/json' \
  -H "partner-token: $PARTNER_TOKEN" \
  -H "Authorization: $USER_TOKEN" \
  -d '{
    "leadType": "PL",
    "payload": {
      "generateExit": true
    }
  }'

# Store lead details from response
export LEAD_ID="LEAD_67890"
export EXIT_ID="EXIT_12345"

# 4.2 Submit Complete Lead Data
curl -X POST 'https://uat-platform.bankkaro.com/partner/loangenius/lead-details' \
  -H 'Content-Type: application/json' \
  -H "partner-token: $PARTNER_TOKEN" \
  -H "Authorization: $USER_TOKEN" \
  -d '{
    "leadType": "PL",
    "payload": {
      "lead_id": "'$LEAD_ID'",
      "exit_id": "'$EXIT_ID'",
      "vendor": "bankkaro",
      "breFlag": true,
      "generateExit": true,
      "first_name": "John",
      "last_name": "Doe",
      "gender": "male",
      "dob": "1990-01-15",
      "pan": "ABCDE1234F",
      "email": "john.doe@example.com",
      "loan_amount_required": "500000",
      "already_existing_credit": false,
      "employmentStatus": "salaried_employee",
      "company_name": "Tech Corp India Private Limited",
      "inhandIncome": "75000",
      "salary_recieved_in": "bank_transfer",
      "pincode": "110001",
      "office_pincode": "110002",
      "city": "New Delhi",
      "state": "Delhi",
      "fetch_credit_consent": true,
      "know_your_credit_score": true,
      "credit_range": "750",
      "total_emis": 2
    }
  }'
```

### **SOP 2: Error Handling & Retry Logic**

#### **Retry Strategy**
```bash
# Function for API calls with retry
api_call_with_retry() {
  local url="$1"
  local method="$2"
  local headers="$3"
  local data="$4"
  local max_attempts=3
  local attempt=1
  local delay=2

  while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt of $max_attempts..."
    
    response=$(curl -s -w "%{http_code}" -X "$method" "$url" $headers -d "$data")
    http_code="${response: -3}"
    body="${response%???}"
    
    case $http_code in
      200|201)
        echo "Success: $body"
        return 0
        ;;
      502|503|504)
        echo "Server error ($http_code), retrying in ${delay}s..."
        sleep $delay
        delay=$((delay * 2))  # Exponential backoff
        ;;
      400|401|403)
        echo "Client error ($http_code): $body"
        return 1
        ;;
      *)
        echo "Unexpected error ($http_code): $body"
        ;;
    esac
    
    attempt=$((attempt + 1))
  done
  
  echo "Max attempts reached, failing..."
  return 1
}
```

### **SOP 3: Data Validation & Transformation**

#### **Input Validation Rules**
```bash
# Validation functions
validate_mobile() {
  local mobile="$1"
  if [[ $mobile =~ ^[6-9][0-9]{9}$ ]]; then
    return 0
  else
    echo "Invalid mobile number: $mobile"
    return 1
  fi
}

validate_pan() {
  local pan="$1"
  if [[ $pan =~ ^[A-Z]{5}[0-9]{4}[A-Z]{1}$ ]]; then
    return 0
  else
    echo "Invalid PAN format: $pan"
    return 1
  fi
}

validate_email() {
  local email="$1"
  if [[ $email =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    return 0
  else
    echo "Invalid email format: $email"
    return 1
  fi
}

validate_pincode() {
  local pincode="$1"
  if [[ $pincode =~ ^[1-9][0-9]{5}$ ]]; then
    return 0
  else
    echo "Invalid pincode: $pincode"
    return 1
  fi
}
```

#### **Data Transformation Functions**
```bash
# Transform employment status
transform_employment() {
  local status="$1"
  case $status in
    "salaried") echo "salaried_employee" ;;
    "self_employed") echo "self_employed" ;;
    "student") echo "student" ;;
    *) echo "salaried_employee" ;;
  esac
}

# Transform salary method
transform_salary_method() {
  local method="$1"
  case $method in
    "bank") echo "bank_transfer" ;;
    "cash") echo "cash" ;;
    "cheque") echo "cheque" ;;
    "upi") echo "upi_digital" ;;
    *) echo "bank_transfer" ;;
  esac
}
```

### **SOP 4: Production Deployment Checklist**

#### **Pre-Deployment Validation**
```bash
#!/bin/bash
# Pre-deployment validation script

echo "🔍 Pre-deployment validation starting..."

# 1. Test Partner Token Generation
echo "1. Testing Partner Token Generation..."
response=$(curl -s -X POST 'https://uat-platform.bankkaro.com/partner/token' \
  -H 'Content-Type: application/json' \
  -d '{"x-api-key": "test"}')

if echo "$response" | grep -q '"status":"success"'; then
  echo "✅ Partner token generation: PASS"
  PARTNER_TOKEN=$(echo "$response" | jq -r '.data.jwttoken')
else
  echo "❌ Partner token generation: FAIL"
  exit 1
fi

# 2. Test OTP Sending (with test number)
echo "2. Testing OTP Send..."
response=$(curl -s -X POST 'https://uat-platform.bankkaro.com/partner/auth' \
  -H 'Content-Type: application/json' \
  -H "partner-token: $PARTNER_TOKEN" \
  -d '{"mobile": "9999999999"}')

if echo "$response" | grep -q '"status":"success"'; then
  echo "✅ OTP send: PASS"
else
  echo "❌ OTP send: FAIL"
  echo "Response: $response"
fi

# 3. Test Company Search
echo "3. Testing Company Search..."
response=$(curl -s -X GET 'https://bk-api.bankkaro.com/sp/api/companies/test?type=PL')

if echo "$response" | grep -q '"status":"success"'; then
  echo "✅ Company search: PASS"
else
  echo "❌ Company search: FAIL"
fi

# 4. Test Pincode Validation
echo "4. Testing Pincode Validation..."
response=$(curl -s -X GET 'https://bk-api.bankkaro.com/sp/api/pincode/110001?type=PL')

if echo "$response" | grep -q '"status":"success"'; then
  echo "✅ Pincode validation: PASS"
else
  echo "❌ Pincode validation: FAIL"
fi

echo "🎉 Pre-deployment validation completed!"
```

---

## 🚨 Error Handling & Troubleshooting

### **Common Error Scenarios & Solutions**

#### **1. Partner Token Issues**
```bash
# Error: Invalid API Key
{
  "status": "error",
  "message": "Invalid API key",
  "code": 401
}

# Solution: Verify API key
curl -X POST 'https://uat-platform.bankkaro.com/partner/token' \
  -H 'Content-Type: application/json' \
  -d '{"x-api-key": "test"}' -v
```

#### **2. OTP Verification Failures**
```bash
# Error: Invalid OTP
{
  "status": "error", 
  "message": "Invalid OTP",
  "code": 400
}

# Solution: Check OTP and epoch token
# Ensure epoch token is from the send OTP response
# OTP is valid for 5 minutes only
```

#### **3. Lead Submission Errors**
```bash
# Error: Missing required fields
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "first_name": "First name is required",
    "pan": "Invalid PAN format"
  }
}

# Solution: Validate all required fields before submission
```

#### **4. Server Errors (502/503/504)**
```bash
# Implement retry logic with exponential backoff
retry_api_call() {
  for i in {1..3}; do
    response=$(curl -s -w "%{http_code}" "$@")
    http_code="${response: -3}"
    
    case $http_code in
      200|201) echo "${response%???}"; return 0 ;;
      502|503|504) 
        echo "Server error, retry $i/3 in $((2**i))s..." >&2
        sleep $((2**i))
        ;;
      *) echo "${response%???}"; return 1 ;;
    esac
  done
  
  echo "Max retries reached" >&2
  return 1
}
```

### **Debugging Commands**

#### **Check API Connectivity**
```bash
# Test basic connectivity
curl -I https://uat-platform.bankkaro.com/partner/token
curl -I https://bk-api.bankkaro.com/sp/api/companies/test

# Test with verbose output
curl -v -X POST 'https://uat-platform.bankkaro.com/partner/token' \
  -H 'Content-Type: application/json' \
  -d '{"x-api-key": "test"}'
```

#### **Validate JSON Payloads**
```bash
# Validate JSON syntax
echo '{"x-api-key": "test"}' | jq '.'

# Pretty print API responses
curl -s -X POST 'https://uat-platform.bankkaro.com/partner/token' \
  -H 'Content-Type: application/json' \
  -d '{"x-api-key": "test"}' | jq '.'
```

---

## 🚀 Production Deployment Guide

### **Environment Variables**
```bash
# Production Environment Variables
export VITE_UAT_API_URL="https://uat-platform.bankkaro.com"
export VITE_EXTERNAL_API_URL="https://bk-api.bankkaro.com"
export VITE_PARTNER_API_KEY="test"  # Replace with production key

# Optional: Rate limiting
export API_RATE_LIMIT="100"  # requests per minute
export API_TIMEOUT="30000"   # 30 seconds
```

### **Production API Testing Script**
```bash
#!/bin/bash
# production-api-test.sh

BASE_URL_UAT="https://uat-platform.bankkaro.com"
BASE_URL_EXTERNAL="https://bk-api.bankkaro.com"
API_KEY="test"  # Replace with production key

echo "🚀 Production API Testing Suite"
echo "================================"

# Test 1: Partner Token Generation
echo "Test 1: Partner Token Generation"
PARTNER_TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL_UAT/partner/token" \
  -H 'Content-Type: application/json' \
  -d "{\"x-api-key\": \"$API_KEY\"}")

if echo "$PARTNER_TOKEN_RESPONSE" | jq -e '.data.jwttoken' > /dev/null; then
  echo "✅ PASS: Partner token generated successfully"
  PARTNER_TOKEN=$(echo "$PARTNER_TOKEN_RESPONSE" | jq -r '.data.jwttoken')
else
  echo "❌ FAIL: Partner token generation failed"
  echo "Response: $PARTNER_TOKEN_RESPONSE"
  exit 1
fi

# Test 2: OTP Send
echo -e "\nTest 2: OTP Send"
OTP_RESPONSE=$(curl -s -X POST "$BASE_URL_UAT/partner/auth" \
  -H 'Content-Type: application/json' \
  -H "partner-token: $PARTNER_TOKEN" \
  -d '{"mobile": "9999999999"}')

if echo "$OTP_RESPONSE" | jq -e '.data.token' > /dev/null; then
  echo "✅ PASS: OTP send working"
else
  echo "❌ FAIL: OTP send failed"
  echo "Response: $OTP_RESPONSE"
fi

# Test 3: Company Search
echo -e "\nTest 3: Company Search"
COMPANY_RESPONSE=$(curl -s -X GET "$BASE_URL_EXTERNAL/sp/api/companies/test?type=PL")

if echo "$COMPANY_RESPONSE" | jq -e '.data' > /dev/null; then
  echo "✅ PASS: Company search working"
else
  echo "❌ FAIL: Company search failed"
  echo "Response: $COMPANY_RESPONSE"
fi

# Test 4: Pincode Validation
echo -e "\nTest 4: Pincode Validation"
PINCODE_RESPONSE=$(curl -s -X GET "$BASE_URL_EXTERNAL/sp/api/pincode/110001?type=PL")

if echo "$PINCODE_RESPONSE" | jq -e '.data' > /dev/null; then
  echo "✅ PASS: Pincode validation working"
else
  echo "❌ FAIL: Pincode validation failed"
  echo "Response: $PINCODE_RESPONSE"
fi

echo -e "\n🎉 Production API Testing Complete!"
```

### **Monitoring & Alerting**
```bash
# API Health Check Script (to be run via cron)
#!/bin/bash
# api-health-check.sh

check_api_health() {
  local url="$1"
  local name="$2"
  
  response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")
  
  if [ "$response" = "200" ]; then
    echo "✅ $name: Healthy"
    return 0
  else
    echo "❌ $name: Unhealthy (HTTP $response)"
    # Send alert (email, Slack, etc.)
    return 1
  fi
}

# Check all critical endpoints
check_api_health "https://uat-platform.bankkaro.com/partner/token" "UAT API"
check_api_health "https://bk-api.bankkaro.com/sp/api/companies/test" "External API"

# Log results
echo "$(date): API health check completed" >> /var/log/api-health.log
```

---

## 📊 Performance Optimization

### **API Response Time Benchmarks**
```bash
# Benchmark API performance
benchmark_api() {
  local url="$1"
  local name="$2"
  
  echo "Benchmarking $name..."
  
  # Run 10 requests and calculate average
  total_time=0
  for i in {1..10}; do
    time=$(curl -s -o /dev/null -w "%{time_total}" "$url")
    total_time=$(echo "$total_time + $time" | bc)
  done
  
  avg_time=$(echo "scale=3; $total_time / 10" | bc)
  echo "$name average response time: ${avg_time}s"
}

# Benchmark all endpoints
benchmark_api "https://uat-platform.bankkaro.com/partner/token" "Partner Token"
benchmark_api "https://bk-api.bankkaro.com/sp/api/companies/test" "Company Search"
```

### **Caching Strategy**
```bash
# Token caching implementation
CACHE_DIR="/tmp/api_cache"
mkdir -p "$CACHE_DIR"

get_cached_token() {
  local cache_file="$CACHE_DIR/partner_token"
  
  if [ -f "$cache_file" ]; then
    local cached_data=$(cat "$cache_file")
    local expiry=$(echo "$cached_data" | jq -r '.expiresAt')
    local current_time=$(date -u +%s)
    local expiry_time=$(date -d "$expiry" +%s)
    
    if [ "$current_time" -lt "$expiry_time" ]; then
      echo "$cached_data" | jq -r '.jwttoken'
      return 0
    fi
  fi
  
  # Token expired or not found, generate new one
  generate_new_token
}

generate_new_token() {
  local response=$(curl -s -X POST 'https://uat-platform.bankkaro.com/partner/token' \
    -H 'Content-Type: application/json' \
    -d '{"x-api-key": "test"}')
  
  # Cache the token
  echo "$response" | jq '.data' > "$CACHE_DIR/partner_token"
  echo "$response" | jq -r '.data.jwttoken'
}
```

---

## 🔒 Security Best Practices

### **API Key Management**
```bash
# Never hardcode API keys in scripts
# Use environment variables or secure vaults

# Good practice
API_KEY="${LOAN_GENIUS_API_KEY:-$(cat /etc/secrets/api_key)}"

# Validate API key format
validate_api_key() {
  local key="$1"
  if [ -z "$key" ] || [ ${#key} -lt 10 ]; then
    echo "Invalid API key format"
    return 1
  fi
}
```

### **Request Signing (if required)**
```bash
# Generate request signature
generate_signature() {
  local method="$1"
  local url="$2"
  local body="$3"
  local timestamp=$(date +%s)
  local secret="$API_SECRET"
  
  # Create signature string
  local string_to_sign="$method|$url|$body|$timestamp"
  
  # Generate HMAC-SHA256 signature
  local signature=$(echo -n "$string_to_sign" | openssl dgst -sha256 -hmac "$secret" -binary | base64)
  
  echo "$signature"
}
```

---

## 📝 Complete Testing Checklist

### **Manual Testing Checklist**
- [ ] Partner token generation works
- [ ] OTP send functionality works
- [ ] OTP verification works (valid OTP)
- [ ] OTP verification fails gracefully (invalid OTP)
- [ ] Lead creation returns lead_id and exit_id
- [ ] Complete lead submission returns loan offers
- [ ] Company search returns results
- [ ] Pincode validation returns location data
- [ ] Error handling works for all failure scenarios
- [ ] Retry logic works for server errors

### **Automated Testing Script**
```bash
#!/bin/bash
# comprehensive-api-test.sh

run_test_suite() {
  echo "🧪 Comprehensive API Test Suite"
  echo "==============================="
  
  local tests_passed=0
  local tests_failed=0
  
  # Test 1: Partner Token
  if test_partner_token; then
    ((tests_passed++))
  else
    ((tests_failed++))
  fi
  
  # Test 2: OTP Flow
  if test_otp_flow; then
    ((tests_passed++))
  else
    ((tests_failed++))
  fi
  
  # Test 3: Lead Management
  if test_lead_management; then
    ((tests_passed++))
  else
    ((tests_failed++))
  fi
  
  # Test 4: Supporting Services
  if test_supporting_services; then
    ((tests_passed++))
  else
    ((tests_failed++))
  fi
  
  echo "==============================="
  echo "Tests Passed: $tests_passed"
  echo "Tests Failed: $tests_failed"
  
  if [ $tests_failed -eq 0 ]; then
    echo "🎉 All tests passed!"
    return 0
  else
    echo "❌ Some tests failed!"
    return 1
  fi
}

# Run the complete test suite
run_test_suite
```

---

## 🎯 Summary

This comprehensive CURL guide provides:

1. **Complete API Flow Logic** - Understand the entire system architecture
2. **All CURL Commands** - Ready-to-use commands for every endpoint
3. **Standard Operating Procedures** - Step-by-step processes for common tasks
4. **Error Handling** - Robust error handling and retry mechanisms
5. **Production Deployment** - Complete deployment and monitoring setup
6. **Security Best Practices** - Secure API key management and request signing
7. **Performance Optimization** - Caching, benchmarking, and monitoring
8. **Testing Framework** - Comprehensive testing scripts and checklists

The system handles the complete loan application journey from user authentication to loan offer generation with proper error handling, retry logic, and production-ready configurations.

**Key Features:**
- ✅ Multi-layer authentication (Partner + User)
- ✅ Two-phase lead management
- ✅ Comprehensive error handling
- ✅ Production-ready deployment scripts
- ✅ Performance monitoring and optimization
- ✅ Security best practices implementation
- ✅ Complete testing framework

This documentation serves as the **definitive guide** for implementing, deploying, and maintaining the Loan Genius API integration system.

