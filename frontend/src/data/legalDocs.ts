export type LegalDocLink = {
  href: string;
  label: string;
};

export type LegalDocGroup = {
  title: string;
  items: LegalDocLink[];
};

type Translator = (key: string) => string;

export function getLegalDocGroups(commonT: Translator, footerT: Translator): LegalDocGroup[] {
  return [
    {
      title: commonT("legal"),
      items: [
        {
          href: "/pages/privacy-policy",
          label: footerT("privacyPolicy"),
        },
        {
          href: "/pages/imprint",
          label: footerT("imprint"),
        },
      ],
    },
    {
      title: commonT("security"),
      items: [
        {
          href: "/pages/vdp",
          label: footerT("vdp"),
        },
      ],
    },
  ];
}
