export type ServiceKey =
  | "webAppSecurity"
  | "penetrationTesting"
  | "secureDevelopment";

export type ServiceVisualType = "windows" | "pulse" | "workflow";

export type ServiceDefinition = {
  key: ServiceKey;
  slug: string;
  visual: ServiceVisualType;
};

export const serviceDefinitions: ServiceDefinition[] = [
  {
    key: "webAppSecurity",
    slug: "web-app-security",
    visual: "windows",
  },
  {
    key: "secureDevelopment",
    slug: "secure-development",
    visual: "workflow",
  },
  {
    key: "penetrationTesting",
    slug: "penetration-testing",
    visual: "pulse",
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return serviceDefinitions.find((service) => service.slug === slug);
}
