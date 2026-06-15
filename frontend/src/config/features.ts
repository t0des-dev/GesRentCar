/**
 * Feature Flags Configuration
 * 
 * This file allows enabling/disabling the new modular architecture features 
 * incrementally to ensure zero regression.
 */

export const features = {
  /** Enables the new modular Fleet architecture */
  newFleetModule: false,
  
  /** Enables the new modular Booking architecture */
  newBookingModule: false,

  /** Enables the new modular Auth architecture */
  newAuthModule: false,

  /** Enables the new modular Payments architecture */
  newPaymentsModule: false,

  /** Enables the new modular Admin architecture */
  newAdminModule: true,

  /** Enables the new modular Storefront architecture */
  newStorefrontModule: true,

  /** Enables the new modular AI architecture */
  newAIModule: true,

  /** Enables the new modular Agent architecture */
  newAgentModule: true,

  /** Enables the new modular Dashboard architecture */
  newDashboardModule: true,
};

export type FeatureFlags = typeof features;
