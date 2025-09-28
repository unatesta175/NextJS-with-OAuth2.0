"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@lib/reduxHooks";
import { changePassword, clearError } from "@/features/auth/authSlice";
import { showErrorToast } from "@lib/toast";

const passwordChangeSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  password: z.string().min(8, "New password must be at least 8 characters"),
  password_confirmation: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const { formState: { errors }, handleSubmit, register, reset, setError } = form;

  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      await dispatch(changePassword(data)).unwrap();
      // Success toast is handled in Redux
      setSuccess(true);
      reset();
      
      // Close modal after showing success message briefly
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error: unknown) {
      console.error('Password change error:', error);
      
      // Handle validation errors and show appropriate error toasts
      if (typeof error === 'object' && error !== null) {
        const errorObj = error as Record<string, string | string[]>;
        
        // Check if it's a validation errors object (from 422 response)
        if ('current_password' in errorObj) {
          const currentPasswordError = errorObj.current_password;
          setError("current_password", { 
            type: "manual", 
            message: Array.isArray(currentPasswordError) ? currentPasswordError[0] : String(currentPasswordError)
          });
          showErrorToast('Old password is incorrect');
        }
        if ('password' in errorObj) {
          const passwordError = errorObj.password;
          setError("password", { 
            type: "manual", 
            message: Array.isArray(passwordError) ? passwordError[0] : String(passwordError)
          });
          showErrorToast('New password and confirm password do not match');
        }
        if ('password_confirmation' in errorObj) {
          const passwordConfirmationError = errorObj.password_confirmation;
          setError("password_confirmation", { 
            type: "manual", 
            message: Array.isArray(passwordConfirmationError) ? passwordConfirmationError[0] : String(passwordConfirmationError)
          });
          showErrorToast('New password and confirm password do not match');
        }
        
        // If no specific field errors, show generic error
        if (!('current_password' in errorObj) && !('password' in errorObj) && !('password_confirmation' in errorObj)) {
          setError("root", { 
            type: "manual", 
            message: "Password change failed. Please try again."
          });
          showErrorToast('Password change failed. Please try again.');
        }
      } else if (typeof error === 'string') {
        setError("root", { 
          type: "manual", 
          message: error 
        });
        showErrorToast(error);
      } else {
        setError("root", { 
          type: "manual", 
          message: "Password change failed. Please try again."
        });
        showErrorToast('Password change failed. Please try again.');
      }
    }
  };

  const handleClose = () => {
    reset();
    setSuccess(false);
    dispatch(clearError());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new secure password.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Changed Successfully!</h3>
            <p className="text-gray-600">Your password has been updated successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("current_password")}
                  className="pl-10 pr-10"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-sm">{errors.current_password.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showNewPassword ? "text" : "password"}
                  {...register("password")}
                  className="pl-10 pr-10"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("password_confirmation")}
                  className="pl-10 pr-10"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm">{errors.password_confirmation.message}</p>
              )}
            </div>

            {/* Error Display */}
            {(error || errors.root) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">
                  {errors.root?.message || (typeof error === 'string' ? error : 'An error occurred')}
                </p>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="bg-primary hover:bg-primary/90"
              >
                Change Password
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
