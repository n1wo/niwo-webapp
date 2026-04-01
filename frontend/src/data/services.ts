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
    key: "penetrationTesting",
    slug: "penetration-testing",
    visual: "pulse",
  },
  {
    key: "secureDevelopment",
    slug: "secure-development",
    visual: "workflow",
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return serviceDefinitions.find((service) => service.slug === slug);
}
