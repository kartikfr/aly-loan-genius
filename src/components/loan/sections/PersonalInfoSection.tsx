import { useQuestionnaire } from '../QuestionnaireContext';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const PersonalInfoSection = () => {
  const { state, updateFormData } = useQuestionnaire();
  const { formData, errors } = state;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-poppins font-semibold text-foreground mb-3">
          Tell us about yourself
        </h2>
        <p className="text-muted-foreground text-lg">
          We need some basic information to get started
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => updateFormData({ first_name: e.target.value })}
              placeholder="Enter your first name"
              className="form-input"
            />
            {errors.first_name && (
              <p className="text-destructive text-sm mt-1">{errors.first_name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => updateFormData({ last_name: e.target.value })}
              placeholder="Enter your last name"
              className="form-input"
            />
            {errors.last_name && (
              <p className="text-destructive text-sm mt-1">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date of Birth *
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal form-input p-4",
                  !formData.dob && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dob ? (
                  format(new Date(formData.dob), "PPP")
                ) : (
                  <span>Pick your date of birth</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dob ? new Date(formData.dob) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const formattedDate = format(date, "yyyy-MM-dd");
                    updateFormData({ dob: formattedDate });
                  }
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1940-01-01")
                }
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                captionLayout="dropdown-buttons"
                fromYear={1940}
                toYear={2006}
              />
            </PopoverContent>
          </Popover>
          {errors.dob && (
            <p className="text-destructive text-sm mt-1">{errors.dob}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            You must be 18+ years old to apply
          </p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Gender *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateFormData({ gender: option.value as any })}
                className={`
                  radio-option text-center
                  ${formData.gender === option.value ? 'selected' : ''}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.gender && (
            <p className="text-destructive text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        {/* PAN Card */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            PAN Card Number *
          </label>
          <input
            type="text"
            value={formData.pan}
            onChange={(e) => updateFormData({ pan: e.target.value.toUpperCase() })}
            placeholder="ABCDE1234F"
            maxLength={10}
            className="form-input"
          />
          {errors.pan && (
            <p className="text-destructive text-sm mt-1">{errors.pan}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Enter your PAN card number exactly as it appears on your card
          </p>
        </div>
      </div>
    </div>
  );
};