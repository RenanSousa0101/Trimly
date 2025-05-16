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

router.get("/users", ensureAuth, ensureAdmin, userController.index)
router.post("/users", ensureAuth, ensureAdmin, userController.create)
router.get("/users/:id", ensureAuth, authorizeAdminOrOwner('id'), userController.show)
router.put("/users/:id", ensureAuth, authorizeAdminOrOwner('id'), userController.update)
router.delete("/users/:id", ensureAuth, ensureAdmin, authorizeAdminOrOwner('id'), ensureNotSelf('id'), userController.delete)

router.get("/users/:id/phones", ensureAuth, authorizeAdminOrOwner('id'), phoneController.show)
router.post("/users/:id/phones", ensureAuth, authorizeAdminOrOwner('id'), phoneController.create)
router.put("/users/:id/phones/:phoneId", ensureAuth, authorizeAdminOrOwner('id'), phoneController.update)
router.delete("/users/:id/phones/:phoneId", ensureAuth, ensureAdmin, authorizeAdminOrOwner('id'), phoneController.delete)

router.get("/users/:id/addresses", ensureAuth, authorizeAdminOrOwner('id'), addressController.show)
router.post("/users/:id/addresses", ensureAuth, authorizeAdminOrOwner('id'), addressController.create)
router.put("/users/:id/addresses/:addressId", ensureAuth, authorizeAdminOrOwner('id'), addressController.update)
router.delete("/users/:id/addresses/:addressId", ensureAuth, ensureAdmin, authorizeAdminOrOwner('id'), addressController.delete)

router.get("/users/:id/roles", ensureAuth, authorizeAdminOrOwner('id'), rolesController.show)
router.post("/users/:id/roles", ensureAuth, authorizeAdminOrOwner('id'), rolesController.create)
router.put("/users/:id/roles/:roleId", ensureAuth, ensureAdmin, authorizeAdminOrOwner('id'), rolesController.update)
router.delete("/users/:id/roles/:roleId", ensureAuth, ensureAdmin, rolesController.delete)

router.get("/users/:id/provider", ensureAuth, ensureAdmin, providerController.index)
router.post("/users/:id/provider", ensureAuth, authorizeAdminOrOwner('id'), providerController.create)
router.get("/users/:id/provider/:providerId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerController.show)
router.put("/users/:id/provider/:providerId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerController.update)
router.delete("/users/:id/provider/:providerId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerController.delete)

router.get("/users/:id/provider/:providerId/specialization", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), specializationController.show)
router.post("/users/:id/provider/:providerId/specialization", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), specializationController.create)
router.put("/users/:id/provider/:providerId/specialization/:specializationId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), specializationController.update)
router.delete("/users/:id/provider/:providerId/specialization/:specializationId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), specializationController.delete)

router.get("/users/:id/provider/:providerId/time", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), timeController.index)
router.get("/users/:id/provider/:providerId/time/:timeId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), timeController.show)
router.post("/users/:id/provider/:providerId/time", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), timeController.create)
router.put("/users/:id/provider/:providerId/time/:timeId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), timeController.update)
router.delete("/users/:id/provider/:providerId/time/:timeId", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), timeController.delete)

router.get("/users/:id/provider/:providerId/serviceCategory", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), serviceCategoryController.index)
router.get("/users/:id/provider/:providerId/serviceCategory/:serviceCategoryId",  ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), serviceCategoryController.show)
router.post("/users/:id/provider/:providerId/serviceCategory", ensureAuth, ensureAdmin, serviceCategoryController.create)
router.put("/users/:id/provider/:providerId/serviceCategory/:serviceCategoryId", ensureAuth, ensureAdmin, serviceCategoryController.update)
router.delete("/users/:id/provider/:providerId/serviceCategory/:serviceCategoryId", ensureAuth, ensureAdmin, serviceCategoryController.delete)

router.get("/users/:id/provider/:providerId/service", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), serviceController.index)
router.get("/users/:id/provider/:providerId/service/:serviceId",  ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), serviceController.show)
router.post("/users/:id/provider/:providerId/service", ensureAuth, ensureAdmin, serviceController.create)
router.put("/users/:id/provider/:providerId/service/:serviceId", ensureAuth, ensureAdmin, serviceController.update)
router.delete("/users/:id/provider/:providerId/service/:serviceId", ensureAuth, ensureAdmin, serviceController.delete)

router.get("/users/:id/provider/:providerId/providerService", ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerServiceController.index)
router.get("/users/:id/provider/:providerId/providerService/:providerServiceId",  ensureAuth, ensureProvider, authorizeAdminOrOwner('id'), providerServiceController.show)
router.post("/users/:id/provider/:providerId/providerService", ensureAuth, ensureProvider, providerServiceController.create)
router.put("/users/:id/provider/:providerId/providerService/:providerServiceId", ensureAuth, ensureProvider, providerServiceController.update)
router.delete("/users/:id/provider/:providerId/providerService/:providerServiceId", ensureAuth, ensureProvider, providerServiceController.delete)

router.get("/users/:id/client", ensureAuth, ensureAdmin, clientController.index)
router.post("/users/:id/client", ensureAuth, authorizeAdminOrOwner('id'), clientController.create)
router.get("/users/:id/client/:clientId", ensureAuth, ensureClient, authorizeAdminOrOwner('id'), clientController.show)
router.put("/users/:id/client/:clientId", ensureAuth, ensureClient, authorizeAdminOrOwner('id'), clientController.update)
router.delete("/users/:id/client/:clientId", ensureAuth, ensureClient, authorizeAdminOrOwner('id'), clientController.delete)

router.post("/users/:id/client/:clientId/provider/:providerId/service/:serviceId/scheduling", ensureAuth, ensureClient, authorizeAdminOrOwner('id'), schedulingController.create)

export { router };