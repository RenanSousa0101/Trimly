import { Router } from "express";
import { ensureAdmin, ensureAuth, ensureProvider, authorizeAdminOrOwner, ensureNotSelf, ensureClient} from "./middlewares/auth-middleware";
import { addressController, authController, clientController, phoneController, providerController, providerServiceController, rolesController, schedulingController, serviceCategoryController, serviceController, specializationController, timeController, userController } from "./container";

const router = Router()

router.post("/auth/register", authController.register);
router.post("/auth/resend-verification", authController.resendVerificationEmail);
router.get("/auth/verify-email", authController.verifyEmail);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.post("/auth/login", authController.login);

router.get("/user", ensureAuth, ensureAdmin, userController.index)
router.post("/user", ensureAuth, ensureAdmin, userController.create)
router.get("/user/:id", ensureAuth, authorizeAdminOrOwner('id'), userController.show)
router.put("/user/:id", ensureAuth, authorizeAdminOrOwner('id'), userController.update)
router.delete("/user/:id", ensureAuth, ensureAdmin, authorizeAdminOrOwner('id'), ensureNotSelf('id'), userController.delete)

router.get("/user/:id/phones", ensureAuth, authorizeAdminOrOwner('id'), phoneController.show)
router.post("/user/:id/phones", ensureAuth, authorizeAdminOrOwner('id'), phoneController.create)
router.put("/user/:id/phones/:phoneId", ensureAuth, authorizeAdminOrOwner('id'), phoneController.update)
router.delete("/user/:id/phones/:phoneId", ensureAuth, ensureAdmin, authorizeAdminOrOwner('id'), phoneController.delete)

router.get("/user/:id/addresses", ensureAuth, authorizeAdminOrOwner('id'), addressController.show)
router.post("/user/:id/addresses", ensureAuth, authorizeAdminOrOwner('id'), addressController.create)
router.put("/user/:id/addresses/:addressId", ensureAuth, authorizeAdminOrOwner('id'), addressController.update)
router.delete("/user/:id/addresses/:addressId", ensureAuth, ensureAdmin, authorizeAdminOrOwner('id'), addressController.delete)

router.get("/user/:id/roles", ensureAuth, authorizeAdminOrOwner('id'), rolesController.show)
router.post("/user/:id/roles", ensureAuth, authorizeAdminOrOwner('id'), rolesController.create)
router.put("/user/:id/roles/:roleId", ensureAuth, ensureAdmin, authorizeAdminOrOwner('id'), rolesController.update)
router.delete("/user/:id/roles/:roleId", ensureAuth, ensureAdmin, rolesController.delete)

router.get("/user/:id/provider", ensureAuth, ensureAdmin, providerController.index)
router.post("/user/:id/provider", ensureAuth, authorizeAdminOrOwner('id'), providerController.create)
router.get("/user/:id/provider/:providerId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerController.show)
router.put("/user/:id/provider/:providerId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerController.update)
router.delete("/user/:id/provider/:providerId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerController.delete)

router.get("/user/:id/provider/:providerId/specialization", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), specializationController.show)
router.post("/user/:id/provider/:providerId/specialization", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), specializationController.create)
router.put("/user/:id/provider/:providerId/specialization/:specializationId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), specializationController.update)
router.delete("/user/:id/provider/:providerId/specialization/:specializationId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), specializationController.delete)

router.get("/user/:id/provider/:providerId/time", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), timeController.index)
router.get("/user/:id/provider/:providerId/time/:timeId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), timeController.show)
router.post("/user/:id/provider/:providerId/time", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), timeController.create)
router.put("/user/:id/provider/:providerId/time/:timeId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), timeController.update)
router.delete("/user/:id/provider/:providerId/time/:timeId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), timeController.delete)

router.get("/user/:id/provider/:providerId/serviceCategory", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), serviceCategoryController.index)
router.get("/user/:id/provider/:providerId/serviceCategory/:serviceCategoryId",  ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), serviceCategoryController.show)
router.post("/user/:id/provider/:providerId/serviceCategory", ensureAuth, ensureAdmin, serviceCategoryController.create)
router.put("/user/:id/provider/:providerId/serviceCategory/:serviceCategoryId", ensureAuth, ensureAdmin, serviceCategoryController.update)
router.delete("/user/:id/provider/:providerId/serviceCategory/:serviceCategoryId", ensureAuth, ensureAdmin, serviceCategoryController.delete)

router.get("/user/:id/provider/:providerId/service", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), serviceController.index)
router.get("/user/:id/provider/:providerId/service/:serviceId",  ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), serviceController.show)
router.post("/user/:id/provider/:providerId/service", ensureAuth, ensureAdmin, serviceController.create)
router.put("/user/:id/provider/:providerId/service/:serviceId", ensureAuth, ensureAdmin, serviceController.update)
router.delete("/user/:id/provider/:providerId/service/:serviceId", ensureAuth, ensureAdmin, serviceController.delete)

router.get("/user/:id/provider/:providerId/providerService", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerServiceController.index)
router.get("/user/:id/provider/:providerId/providerService/:providerServiceId",  ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerServiceController.show)
router.post("/user/:id/provider/:providerId/providerService", ensureAuth, ensureProvider, providerServiceController.create)
router.put("/user/:id/provider/:providerId/providerService/:providerServiceId", ensureAuth, ensureProvider, providerServiceController.update)
router.delete("/user/:id/provider/:providerId/providerService/:providerServiceId", ensureAuth, ensureProvider, providerServiceController.delete)

router.get("/user/:id/client", ensureAuth, ensureAdmin, clientController.index)
router.post("/user/:id/client", ensureAuth, authorizeAdminOrOwner('id'), clientController.create)
router.get("/user/:id/client/:clientId", ensureAuth, ensureClient, authorizeAdminOrOwner('id'), clientController.show)
router.put("/user/:id/client/:clientId", ensureAuth, ensureClient, authorizeAdminOrOwner('id'), clientController.update)
router.delete("/user/:id/client/:clientId", ensureAuth, ensureClient, authorizeAdminOrOwner('id'), clientController.delete)

router.post("/user/:id/client/:clientId/provider/:providerId/service/:serviceId/scheduling", ensureAuth, ensureClient, authorizeAdminOrOwner('id'), schedulingController.create)

export { router };