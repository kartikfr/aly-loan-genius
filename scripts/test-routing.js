#!/usr/bin/env node

/**
 * Test script to verify SPA routing configuration
 * Run this after deployment to ensure all routes work correctly
 */

const https = require('https');
const http = require('http');

// Get the deployment URL from command line or use default
const baseUrl = process.argv[2] || 'https://your-app.vercel.app';

const testRoutes = [
  '/',
  '/questionnaire',
  '/loan-offers',
  '/non-existent-route',
  '/api/uat/test',
  '/api/external/test'
];

function testRoute(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
        const isHtml = data.includes('<!DOCTYPE html>') || data.includes('<html');
        
        resolve({
          url,
          statusCode: res.statusCode,
          isSuccess,
          isHtml,
          isApiRoute: url.includes('/api/')
        });
      });
    }).on('error', (err) => {
      reject({ url, error: err.message });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing SPA Routing Configuration...\n');
  console.log(`Base URL: ${baseUrl}\n`);
  
  const results = [];
  
  for (const route of testRoutes) {
    const fullUrl = `${baseUrl}${route}`;
    try {
      const result = await testRoute(fullUrl);
      results.push(result);
      
      const status = result.isSuccess ? '✅' : '❌';
      const type = result.isApiRoute ? 'API' : 'SPA';
      
      console.log(`${status} ${route} (${result.statusCode}) - ${type} Route`);
    } catch (error) {
      console.log(`❌ ${route} - Error: ${error.error}`);
      results.push({ url: fullUrl, error: error.error });
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const spaRoutes = results.filter(r => !r.isApiRoute && !r.error);
  const apiRoutes = results.filter(r => r.isApiRoute && !r.error);
  const errors = results.filter(r => r.error);
  
  console.log(`✅ SPA Routes Working: ${spaRoutes.length}/${testRoutes.filter(r => !r.includes('/api/')).length}`);
  console.log(`✅ API Routes Working: ${apiRoutes.length}/${testRoutes.filter(r => r.includes('/api/')).length}`);
  console.log(`❌ Errors: ${errors.length}`);
  
  // Check if SPA routing is working correctly
  const spaWorking = spaRoutes.every(r => r.isHtml && r.isSuccess);
  const apiWorking = apiRoutes.every(r => r.isSuccess);
  
  if (spaWorking && apiWorking) {
    console.log('\n🎉 All tests passed! SPA routing is configured correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check your Vercel configuration.');
    
    if (!spaWorking) {
      console.log('❌ SPA routes are not serving HTML correctly');
    }
    if (!apiWorking) {
      console.log('❌ API routes are not working correctly');
    }
  }
}

// Run the tests
runTests().catch(console.error); 