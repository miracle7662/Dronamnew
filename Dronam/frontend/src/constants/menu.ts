export interface MenuItemTypes {
  key: string
  label: string
  isTitle?: boolean
  icon?: string
  url?: string
  parentKey?: string
  target?: string
  children?: MenuItemTypes[]
  roles?: string[] // Add roles to control access
}

const MENU_ITEMS: MenuItemTypes[] = [
  //Navigation
  {
    key: 'navigation',
    label: 'Navigation',
    isTitle: true,
  },
  {
    key: 'dashboards',
    label: 'HOME',
    isTitle: false,
    icon: 'fi fi-rr-dashboard',
    url: '/dashboards/crm',
  },

  // Apps
  {
    key: 'apps',
    label: 'WebApps',
    isTitle: true,
  },
  
  {
    key: 'Menu',
    label: 'Menu',
    url: '/apps/menu',
    icon: 'fi fi-rr-rectangle-list',
    parentKey: 'apps',
  },

  {
    key: 'Costumers',
    label: 'Costumers',
    url: '/apps/costumers',
    icon: 'fi fi-rs-user-headset',
    parentKey: 'apps',
  },
  {
    key: 'Reports',
    label: 'Reports',
    url: '/apps/reports',
    icon: 'fi fi-rs-mobile',
    parentKey: 'apps',
  },

  {
    key: 'Settings',
    label: 'Settings',
    url: '/apps/settings',
    icon: 'fi fi-rr-settings',
    parentKey: 'apps',
  },

  {
    key: 'Logout',
    label: 'logout',
    url: '/apps/logout',
    icon: 'fi fi-sr-sign-out-alt',
    parentKey: 'apps',
  },
  

 

  


 
  {
    key: 'masterPages',
    label: 'Masterpages',
    isTitle: false,
    icon: 'fi fi-rr-dashboard',
    children: [
      {
        key: 'country ',
        label: 'Country',
        url: '/masterpages/country',
        parentKey: 'masterPages',
      },
      {
        key: 'states',
        label: 'States',
        url: '/masterpages/states',
        parentKey: 'masterPages',
      },

      {
        key: 'city',
        label: 'City',
        url: '/masterpages/city',
        parentKey: 'masterPages',
      },
    {
      key: 'Blockmaster',
      label: 'Blockmaster',
      url: '/masterpages/Blockmaster',
      parentKey: 'masterPages',
    },
    {
      key:'GuestTypemaster',
      label:'GuestTypemaster',
      url:'/masterpages/GuestTypemaster',
      parentKey:'masterPages',
    },
    {
      key:'NationalityMsaster',
      label:'NationalityMaster',
      url:'/masterpages/NationalityMaster',
      parentKey:'masterPages',
    },
    {
      key:'FloorMaster',
      label:'FloorMaster',
      url:'/masterpages/FloorMaster',
      parentKey:'masterPages',  
    },
    {
      key:'NewsPaperMaster',
      label:'NewsPaperMaster',
      url:'/masterpages/NewsPaperMaster',
      parentKey:'masterPages',
    },

    {
      key:'NoteMaster',
      label:'NoteMaster',
      url:'/masterpages/NoteMaster',
      parentKey:'masterPages',
    },
    {
      key:'RoomMaster',
      label:'RoomMaster',
      url:'/masterpages/RoomMaster',
      parentKey:'masterPages',
    },
    {
      key:'RoomcategoryMaster',
      label:'RoomcategoryMaster',
      url:'/masterpages/RoomCategoryMaster',
      parentKey:'masterPages',
    },
    {
      key:'GuestMaster',
      label:'GuestMaster',
      url:'/masterpages/GuestMaster',
      parentKey:'masterPages',
    },
    {
      key:'fragmentMaster', 
      label:'FragmentMaster',
      url:'/masterpages/FragmentMaster',
      parentKey:'masterPages',
    },
    {
      key:'BookMaster',
      label:'BookMaster',
      url:'/masterpages/BookMaster',
      parentKey:'masterPages',
    },
    {
      key:'FeatureMaster',
      label:'FeatureMaster',
      url:'/masterpages/FeatureMaster',
      parentKey:'masterPages',
    },
    {
      key:'companyMaster',
      label:'CompanyMaster',
      url:'/masterpages/CompanyMaster',
      parentKey:'masterPages',
    }
    ],
  },

  // Common Masters Section
  {
    key: 'commonMasters',
    label: 'Common Masters',
    isTitle: false,
    icon: 'fi fi-rr-globe',
    children: [
      {
        key: 'countryMaster',
        label: 'Country Master',
        url: '/apps/country',
        parentKey: 'commonMasters',
      },
      {
        key: 'stateMaster',
        label: 'State Master',
        url: '/apps/states',
        parentKey: 'commonMasters',
      },
      {
        key: 'districtMaster',
        label: 'District Master',
        url: '/apps/districts',
        parentKey: 'commonMasters',
      },
      {
        key: 'zoneMaster',
        label: 'Zone Master',
        url: '/apps/zones',
        parentKey: 'commonMasters',
      },
      {
        key: 'ManageAgents',
        label: 'Manage Agents',
        url: '/commonMasters/ManageAgents',
        parentKey: 'commonMasters',
      },
    ],
  },

  {
    key: 'invoice',
    label: 'Invoice',
    url: '/apps/invoice',
    icon: 'fi fi-rr-file-invoice',
    parentKey: 'apps',
  },

  // Pages
  {
    key: 'pages',
    label: 'UI Pages',
    isTitle: true,
  },
  {
    key: 'account',
    label: 'User Profile',
    isTitle: false,
    icon: 'fi fi-rr-circle-user',
    children: [
      {
        key: 'account-overview',
        label: 'Overview',
        url: '/user-profile/overview',
        parentKey: 'account',
      },
      {
        key: 'account-activity',
        label: 'Activity',
        url: '/user-profile/activity',
        parentKey: 'account',
      },
      {
        key: 'account-followers',
        label: 'Followers',
        url: '/user-profile/followers',
        parentKey: 'account',
      },
      {
        key: 'account-contacts',
        label: 'Contacts',
        url: '/user-profile/contacts',
        parentKey: 'account',
      },
      {
        key: 'account-projects',
        label: 'Projects',
        url: '/user-profile/projects',
        parentKey: 'account',
      },
      {
        key: 'account-gallery',
        label: 'Gallery',
        url: '/user-profile/gallery',
        parentKey: 'account',
      },
    ],
  },
  {
    key: 'settings',
    label: 'Account Settings',
    isTitle: false,
    icon: 'fi fi-rr-user-gear',
    children: [
      {
        key: 'settings-account',
        label: 'Account',
        url: '/account-settings/account',
        parentKey: 'settings',
      },
      {
        key: 'settings-password-security',
        label: 'Security',
        url: '/account-settings/security',
        parentKey: 'settings',
      },
      {
        key: 'settings-notifications',
        label: 'Notifications',
        url: '/account-settings/notifications',
        parentKey: 'settings',
      },
      {
        key: 'settings-plan-billing',
        label: 'Plan & Billing',
        url: '/account-settings/billing',
        parentKey: 'settings',
      },
      {
        key: 'settings-integrations',
        label: 'Integrations',
        url: '/account-settings/integrations',
        parentKey: 'settings',
      },
    ],
  },
  {
    key: 'other-pages',
    label: 'Other Pages',
    isTitle: false,
    icon: 'fi fi-rr-browser',
    children: [
      {
        key: 'other-starter',
        label: 'Starter',
        url: '/other-pages/starter',
        parentKey: 'other-pages',
      },
      {
        key: 'other-faqs',
        label: 'FAQs',
        url: '/other-pages/faqs',
        parentKey: 'other-pages',
      },
      {
        key: 'other-pricing',
        label: 'Pricing',
        url: '/other-pages/pricing',
        parentKey: 'other-pages',
      },
      {
        key: 'other-about-us',
        label: 'About Us',
        url: '/other-pages/about-us',
        parentKey: 'other-pages',
      },
      {
        key: 'other-contact-us',
        label: 'Contact Us',
        url: '/other-pages/contact-us',
        parentKey: 'other-pages',
      },
      {
        key: 'other-privacy-policy',
        label: 'Privacy & Policy',
        url: '/other-pages/privacy-policy',
        parentKey: 'other-pages',
      },
      {
        key: 'other-terms-services',
        label: 'Terms of Services',
        url: '/other-pages/terms-services',
        parentKey: 'other-pages',
      },
    ],
  },
  // Authentication
  {
    key: 'auth',
    label: 'Authentication',
    isTitle: false,
    icon: 'fi fi-rr-lock',
    children: [
      {
        key: 'auth-login',
        label: 'Login',
        parentKey: 'auth',
        children: [
          {
            key: 'auth-login-minimal',
            label: 'Minimal',
            url: '/auth/minimal/login',
            parentKey: 'auth-login',
          },
          {
            key: 'auth-login-classic',
            label: 'Classic',
            url: '/auth/classic/login',
            parentKey: 'auth-login',
          },
          {
            key: 'auth-login-creative',
            label: 'Creative',
            url: '/auth/creative/login',
            parentKey: 'auth-login',
          },
          {
            key: 'auth-login-corporate',
            label: 'Corporate',
            url: '/auth/corporate/login',
            parentKey: 'auth-login',
          },
          {
            key: 'auth-login-modern',
            label: 'Modern',
            url: '/auth/modern/login',
            parentKey: 'auth-login',
          },
        ],
      },
      {
        key: 'auth-register',
        label: 'Register',
        parentKey: 'auth',
        children: [
          {
            key: 'auth-register-minimal',
            label: 'Minimal',
            url: '/auth/minimal/register',
            parentKey: 'auth-register',
          },
          {
            key: 'auth-register-classic',
            label: 'Classic',
            url: '/auth/classic/register',
            parentKey: 'auth-register',
          },
          {
            key: 'auth-register-creative',
            label: 'Creative',
            url: '/auth/creative/register',
            parentKey: 'auth-register',
          },
          {
            key: 'auth-register-corporate',
            label: 'Corporate',
            url: '/auth/corporate/register',
            parentKey: 'auth-register',
          },
          {
            key: 'auth-register-modern',
            label: 'Modern',
            url: '/auth/modern/register',
            parentKey: 'auth-register',
          },
        ],
      },
      {
        key: 'auth-register-success',
        label: 'Register Success',
        parentKey: 'auth',
        children: [
          {
            key: 'auth-register-minimal-success',
            label: 'Minimal',
            url: '/auth/minimal/register-success',
            parentKey: 'auth-register-success',
          },
          {
            key: 'auth-register-classic-success',
            label: 'Classic',
            url: '/auth/classic/register-success',
            parentKey: 'auth-register-success',
          },
          {
            key: 'auth-register-creative-success',
            label: 'Creative',
            url: '/auth/creative/register-success',
            parentKey: 'auth-register-success',
          },
          {
            key: 'auth-register-corporate-success',
            label: 'Corporate',
            url: '/auth/corporate/register-success',
            parentKey: 'auth-register-success',
          },
          {
            key: 'auth-register-modern-success',
            label: 'Modern',
            url: '/auth/modern/register-success',
            parentKey: 'auth-register-success',
          },
        ],
      },
      {
        key: 'auth-reset-password',
        label: 'Reset Password',
        parentKey: 'auth',
        children: [
          {
            key: 'auth-reset-password-minimal',
            label: 'Minimal',
            url: '/auth/minimal/reset-password',
            parentKey: 'auth-reset-password',
          },
          {
            key: 'auth-reset-password-classic',
            label: 'Classic',
            url: '/auth/classic/reset-password',
            parentKey: 'auth-reset-password',
          },
          {
            key: 'auth-reset-password-creative',
            label: 'Creative',
            url: '/auth/creative/reset-password',
            parentKey: 'auth-reset-password',
          },
          {
            key: 'auth-reset-password-corporate',
            label: 'Corporate',
            url: '/auth/corporate/reset-password',
            parentKey: 'auth-reset-password',
          },
          {
            key: 'auth-reset-password-modern',
            label: 'Modern',
            url: '/auth/modern/reset-password',
            parentKey: 'auth-reset-password',
          },
        ],
      },
      {
        key: 'auth-forgot-password',
        label: 'Forgot Password',
        parentKey: 'auth',
        children: [
          {
            key: 'auth-forgot-password-minimal',
            label: 'Minimal',
            url: '/auth/minimal/forgot-password',
            parentKey: 'auth-forgot-password',
          },
          {
            key: 'auth-forgot-password-classic',
            label: 'Classic',
            url: '/auth/classic/forgot-password',
            parentKey: 'auth-forgot-password',
          },
          {
            key: 'auth-forgot-password-creative',
            label: 'Creative',
            url: '/auth/creative/forgot-password',
            parentKey: 'auth-forgot-password',
          },
          {
            key: 'auth-forgot-password-corporate',
            label: 'Corporate',
            url: '/auth/corporate/forgot-password',
            parentKey: 'auth-forgot-password',
          },
          {
            key: 'auth-forgot-password-modern',
            label: 'Modern',
            url: '/auth/modern/forgot-password',
            parentKey: 'auth-forgot-password',
          },
        ],
      },
      {
        key: 'auth-otp',
        label: 'Two-factor (OTP)',
        parentKey: 'auth',
        children: [
          {
            key: 'auth-otp-minimal',
            label: 'Minimal',
            url: '/auth/minimal/otp',
            parentKey: 'auth-otp',
          },
          {
            key: 'auth-otp-classic',
            label: 'Classic',
            url: '/auth/classic/otp',
            parentKey: 'auth-otp',
          },
          {
            key: 'auth-otp-creative',
            label: 'Creative',
            url: '/auth/creative/otp',
            parentKey: 'auth-otp',
          },
          {
            key: 'auth-otp-corporate',
            label: 'Corporate',
            url: '/auth/corporate/otp',
            parentKey: 'auth-otp',
          },
          {
            key: 'auth-otp-modern',
            label: 'Modern',
            url: '/auth/modern/otp',
            parentKey: 'auth-otp',
          },
        ],
      },
      {
        key: 'auth-lock-screen',
        label: 'Lock Screen',
        parentKey: 'auth',
        children: [
          {
            key: 'auth-lock-screen-minimal',
            label: 'Minimal',
            url: '/auth/minimal/lock-screen',
            parentKey: 'auth-lock-screen',
          },
          {
            key: 'auth-lock-screen-classic',
            label: 'Classic',
            url: '/auth/classic/lock-screen',
            parentKey: 'auth-lock-screen',
          },
          {
            key: 'auth-lock-screen-creative',
            label: 'Creative',
            url: '/auth/creative/lock-screen',
            parentKey: 'auth-lock-screen',
          },
          {
            key: 'auth-lock-screen-corporate',
            label: 'Corporate',
            url: '/auth/corporate/lock-screen',
            parentKey: 'auth-lock-screen',
          },
          {
            key: 'auth-lock-screen-modern',
            label: 'Modern',
            url: '/auth/modern/lock-screen',
            parentKey: 'auth-lock-screen',
          },
        ],
      },
    ],
  },
  // Error
  {
    key: 'error-pages',
    label: 'Error Pages',
    isTitle: false,
    icon: 'fi fi-rr-times-hexagon',
    children: [
      {
        key: 'error-not-found',
        label: '404 Not Found',
        url: '/error-pages/not-found',
        parentKey: 'error-pages',
      },
      {
        key: 'error-not-authorized',
        label: '401 Not Authorized',
        url: '/error-pages/not-authorized',
        parentKey: 'error-pages',
      },
      {
        key: 'error-server-error',
        label: '500 Server Error',
        url: '/error-pages/server-error',
        parentKey: 'error-pages',
      },
      {
        key: 'error-comming-soon',
        label: 'Comming Soon',
        url: '/error-pages/comming-soon',
        parentKey: 'error-pages',
      },
      {
        key: 'error-maintenance',
        label: 'Under Maintenance',
        url: '/error-pages/under-maintenance',
        parentKey: 'error-pages',
      },
    ],
  },
  // Email Templates
  {
    key: 'etemplates',
    label: 'Email Templates',
    isTitle: false,
    icon: 'fi fi-rr-at',
    children: [
      {
        key: 'et-welcome-message',
        label: 'Welcome Message',
        url: '/email-template/et-welcome-message',
        parentKey: 'etemplates',
      },
      {
        key: 'et-confirm-account',
        label: 'Confirm Account',
        url: '/email-template/et-confirm-account',
        parentKey: 'etemplates',
      },
      {
        key: 'et-reset-password',
        label: 'Reset Password',
        url: '/email-template/et-reset-password',
        parentKey: 'etemplates',
      },
      {
        key: 'et-expired-card',
        label: 'Expired Card',
        url: '/email-template/et-expired-card',
        parentKey: 'etemplates',
      },
      {
        key: 'et-coupon-sale',
        label: 'Coupon Sale',
        url: '/email-template/et-coupon-sale',
        parentKey: 'etemplates',
      },
      {
        key: 'et-latest-update',
        label: 'Latest Update',
        url: '/email-template/et-latest-update',
        parentKey: 'etemplates',
      },
    ],
  },
  // Components
  {
    key: 'components',
    label: 'Components',
    isTitle: true,
  },
  {
    key: 'base-ui',
    label: 'Base UI',
    isTitle: false,
    icon: 'fi fi-rr-layers',
    children: [
      {
        key: 'base-accordions',
        label: 'Accordions',
        url: '/components/base/accordions',
        parentKey: 'base-ui',
      },
      {
        key: 'base-avatars',
        label: 'Avatars',
        url: '/components/base/avatars',
        parentKey: 'base-ui',
      },
      {
        key: 'base-buttons',
        label: 'Buttons',
        url: '/components/base/buttons',
        parentKey: 'base-ui',
      },
      {
        key: 'base-cards',
        label: 'Cards',
        url: '/components/base/cards',
        parentKey: 'base-ui',
      },
      {
        key: 'base-carousel',
        label: 'Carousel',
        url: '/components/base/carousel',
        parentKey: 'base-ui',
      },
      {
        key: 'base-dropdowns',
        label: 'Dropdowns',
        url: '/components/base/dropdowns',
        parentKey: 'base-ui',
      },
      {
        key: 'base-modals',
        label: 'Modals',
        url: '/components/base/modals',
        parentKey: 'base-ui',
      },
      {
        key: 'base-navtab',
        label: 'NavTabs',
        url: '/components/base/navtabs',
        parentKey: 'base-ui',
      },
      {
        key: 'base-toast',
        label: 'Toasts',
        url: '/components/base/toasts',
        parentKey: 'base-ui',
      },
      {
        key: 'base-miscellaneous',
        label: 'Miscellaneous',
        url: '/components/base/miscellaneous',
        parentKey: 'base-ui',
      },
    ],
  },
  {
    key: 'icons',
    label: 'Icons',
    isTitle: false,
    icon: 'fi fi-rr-heart',
    children: [
      {
        key: 'icons-flaticon',
        label: 'Flaticon',
        url: '/components/icons/flaticon',
        parentKey: 'icons',
      },
      {
        key: 'icons-feather',
        label: 'Feather',
        url: '/components/icons/feather',
        parentKey: 'icons',
      },
      {
        key: 'icons-bootstrap',
        label: 'Bootstrap',
        url: '/components/icons/bootstrap',
        parentKey: 'icons',
      },
      {
        key: 'icons-boxicons',
        label: 'BoxIcons',
        url: '/components/icons/boxicons',
        parentKey: 'icons',
      },
      {
        key: 'icons-fontawesome',
        label: 'Fontawesome',
        url: '/components/icons/fontawesome',
        parentKey: 'icons',
      },
      {
        key: 'icons-lucide',
        label: 'Lucide',
        url: '/components/icons/lucide',
        parentKey: 'icons',
      },
      {
        key: 'icons-tabler ',
        label: 'Tabler',
        url: '/components/icons/tabler',
        parentKey: 'icons',
      },
      {
        key: 'icons-weather',
        label: 'Weather',
        url: '/components/icons/weather',
        parentKey: 'icons',
      },
    ],
  },
  {
    key: 'tables',
    label: 'Tables',
    isTitle: false,
    icon: 'fi fi-rr-table-list',
    children: [
      {
        key: 'bootstap-table',
        label: 'Bootstrap',
        url: '/components/tables/bootstap-table',
        parentKey: 'tables',
      },
      {
        key: 'react-table',
        label: 'ReactTable',
        url: '/components/tables/react-table',
        parentKey: 'tables',
      },
    ],
  },
  {
    key: 'charts',
    label: 'Charts',
    isTitle: false,
    icon: 'fi fi-rr-chart-histogram',
    children: [
      {
        key: 'apexcharts',
        label: 'Apexcharts',
        url: '/components/charts/apexcharts',
        parentKey: 'charts',
      },
      {
        key: 'chartjs',
        label: 'ChartJS',
        url: '/components/charts/chartjs',
        parentKey: 'charts',
      },
      {
        key: 'recharts',
        label: 'Recharts',
        url: '/components/charts/recharts',
        parentKey: 'charts',
      },
      {
        key: 'progressbar',
        label: 'Progressbar',
        url: '/components/charts/progressbar',
        parentKey: 'charts',
      },
    ],
  },
  {
    key: 'forms',
    label: 'Forms',
    isTitle: false,
    icon: 'fi fi-rr-calendar-lines-pen',
    children: [
      {
        key: 'forms-adv-radio',
        label: 'Radios',
        url: '/components/forms/adv-radio',
        parentKey: 'forms',
      },
      {
        key: 'forms-adv-checkbox',
        label: 'Checkboxs',
        url: '/components/forms/adv-checkbox',
        parentKey: 'forms',
      },
      {
        key: 'forms-adv-switch',
        label: 'Switchs',
        url: '/components/forms/adv-switch',
        parentKey: 'forms',
      },
      {
        key: 'forms-elements',
        label: 'Elements',
        url: '/components/forms/elements',
        parentKey: 'forms',
      },
      {
        key: 'forms-validation',
        label: 'Validation',
        url: '/components/forms/validation',
        parentKey: 'forms',
      },
      {
        key: 'forms-inputmask',
        label: 'InputMask',
        url: '/components/forms/inputmask',
        parentKey: 'forms',
      },
      {
        key: 'forms-nouislider',
        label: 'noUiSlider',
        url: '/components/forms/nouislider',
        parentKey: 'forms',
      },
    ],
  },
  {
    key: 'editors',
    label: 'Editors',
    isTitle: false,
    icon: 'fi fi-rr-object-group',
    children: [
      {
        key: 'editors-quill',
        label: 'Quill',
        url: '/components/editors/quill',
        parentKey: 'editors',
      },
      {
        key: 'editors-tinymce',
        label: 'TinyMCE',
        url: '/components/editors/tinymce',
        parentKey: 'editors',
      },
    ],
  },
  {
    key: 'pickers',
    label: 'Pickers',
    isTitle: false,
    icon: 'fi fi-rr-eye-dropper',
    children: [
      {
        key: 'pickers-flatpickr',
        label: 'Flatpickr',
        url: '/components/pickers/flatpickr',
        parentKey: 'pickers',
      },
      {
        key: 'pickers-daterangepicker',
        label: 'DateRange',
        url: '/components/pickers/daterangepicker',
        parentKey: 'pickers',
      },
    ],
  },
  {
    key: 'maps',
    label: 'Maps',
    isTitle: false,
    icon: 'fi fi-rr-marker',
    children: [
      {
        key: 'maps-vector',
        label: 'Vector',
        url: '/components/maps/vector-maps',
        parentKey: 'maps',
      },
    ],
  },
  {
    key: 'extended',
    label: 'Extended',
    isTitle: false,
    icon: 'fi fi-rr-apps-add',
    children: [
      {
        key: 'extended-select2',
        label: 'Select2',
        url: '/components/extended/select2',
        parentKey: 'extended',
      },
      {
        key: 'extended-sweetalert2',
        label: 'SweetAlert2',
        url: '/components/extended/sweetalert2',
        parentKey: 'extended',
      },
      {
        key: 'extended-slick',
        label: 'Slick Slider',
        url: '/components/extended/react-slick',
        parentKey: 'extended',
      },
      {
        key: 'extended-dropzone',
        label: 'Dropzone',
        url: '/components/extended/dropzone',
        parentKey: 'extended',
      },
      {
        key: 'extended-hot-toast',
        label: 'Hot Toast',
        url: '/components/extended/hottoast',
        parentKey: 'extended',
      },
      {
        key: 'extended-toastify',
        label: 'Toastify',
        url: '/components/extended/toastify',
        parentKey: 'extended',
      },
    ],
  },
  {
    key: 'multi-level',
    label: 'Multi Level',
    isTitle: false,
    icon: 'fi fi-rs-add',
    children: [
      {
        key: 'level-one',
        label: 'Level 1',
        url: '#!',
        parentKey: 'multi-level',
      },
      {
        key: 'third-level',
        label: 'Level 1',
        url: '#!',
        parentKey: 'multi-level',
        children: [
          {
            key: 'third-level-1',
            label: 'Level 2',
            url: '#!',
            parentKey: 'third-level',
          },
          {
            key: 'third-level-2',
            label: 'Level 2',
            url: '#!',
            parentKey: 'third-level',
            children: [
              {
                key: 'third-level-2-1',
                label: 'Level 3',
                url: '#!',
                parentKey: 'third-level-2',
              },
              {
                key: 'third-level-2-2',
                label: 'Level 3',
                url: '#!',
                parentKey: 'third-level-2',
              },
            ],
          },
        ],
      },
    ],
  },
  // Docs
  {
    key: 'docs',
    label: 'Helpdesk',
    isTitle: true,
  },
  {
    key: 'support',
    label: 'Support',
    isTitle: false,
    url: '../docs/support.html',
    icon: 'fi fi-rr-life-ring',
    parentKey: 'docs',
  },
  {
    key: 'changelog',
    label: 'Changelog',
    isTitle: false,
    url: '../docs/changelog.html',
    icon: 'fi fi-rr-square-terminal',
    parentKey: 'docs',
  },
  {
    key: 'documentation',
    label: 'Documentation',
    isTitle: false,
    url: '../docs/index.html',
    icon: 'fi fi-rr-book-alt',
    parentKey: 'docs',
  },
]
export { MENU_ITEMS }

const HORIZONTAL_MENU_ITEMS: MenuItemTypes[] = [
  {
    key: 'dashboard',
    label: 'Dashboards',
    isTitle: true,
    icon: 'fi fi-rr-dashboard',
    children: [
      {
        key: 'ecommerce',
        label: 'eCommerce',
        url: '/',
        parentKey: 'dashboard',
      },
      {
        key: 'analytics',
        label: 'Analytics',
        url: '/dashboards/analytics',
        parentKey: 'dashboard',
      },
      {
        key: 'crm',
        label: 'CRM',
        url: '/dashboards/crm',
        parentKey: 'dashboard',
      },
      // {
      //   key: 'pos',
      //   label: 'POS',
      //   url: '#!',
      //   parentKey: 'dashboards',
      // },
      // {
      //   key: 'nft',
      //   label: 'NFT',
      //   url: '#!',
      //   parentKey: 'dashboards',
      // },
      // {
      //   key: 'project',
      //   label: 'Project',
      //   url: '#!',
      //   parentKey: 'dashboards',
      // },
    ],
  },
  {
    key: 'app',
    label: 'Webapps',
    isTitle: true,
    icon: 'fi fi-rr-apps-add',
    children: [
      // {
      //   key: 'chat',
      //   label: 'Chat',
      //   url: '/apps/chat',
      //   parentKey: 'app',
      // },
      {
        key: 'email',
        label: 'Email',
        url: '/apps/email',
        parentKey: 'app',
      },
      {
        key: 'contact',
        label: 'Contact',
        url: '/apps/contact',
        parentKey: 'app',
      },
      {
        key: 'invoice',
        label: 'Invoice',
        url: '/apps/invoice',
        parentKey: 'app',
      },
      {
        key: 'kanban',
        label: 'Kanban',
        url: '/apps/kanban',
        parentKey: 'app',
      },
      {
        key: 'calendar',
        label: 'Calendar',
        url: '/apps/calendar',
        parentKey: 'app',
      },
    ],
  },
  {
    key: 'component',
    icon: 'fi fi-rr-layers',
    label: 'Components',
    isTitle: true,
    children: [
      {
        key: 'base-ui',
        label: 'Base UI',
        isTitle: false,
        parentKey: 'component',
        children: [
          {
            key: 'base-accordions',
            label: 'Accordions',
            url: '/components/base/accordions',
            parentKey: 'base-ui',
          },
          {
            key: 'base-avatars',
            label: 'Avatars',
            url: '/components/base/avatars',
            parentKey: 'base-ui',
          },
          {
            key: 'base-buttons',
            label: 'Buttons',
            url: '/components/base/buttons',
            parentKey: 'base-ui',
          },
          {
            key: 'base-cards',
            label: 'Cards',
            url: '/components/base/cards',
            parentKey: 'base-ui',
          },
          {
            key: 'base-carousel',
            label: 'Carousel',
            url: '/components/base/carousel',
            parentKey: 'base-ui',
          },
          {
            key: 'base-dropdowns',
            label: 'Dropdowns',
            url: '/components/base/dropdowns',
            parentKey: 'base-ui',
          },
          {
            key: 'base-modals',
            label: 'Modals',
            url: '/components/base/modals',
            parentKey: 'base-ui',
          },
          {
            key: 'base-navtab',
            label: 'NavTabs',
            url: '/components/base/navtabs',
            parentKey: 'base-ui',
          },
          {
            key: 'base-toast',
            label: 'Toasts',
            url: '/components/base/toasts',
            parentKey: 'base-ui',
          },
          {
            key: 'base-miscellaneous',
            label: 'Miscellaneous',
            url: '/components/base/miscellaneous',
            parentKey: 'base-ui',
          },
        ],
      },
      {
        key: 'icons',
        label: 'Icons',
        isTitle: false,
        parentKey: 'component',
        children: [
          {
            key: 'icons-flaticon',
            label: 'Flaticon',
            url: '/components/icons/flaticon',
            parentKey: 'icons',
          },
          {
            key: 'icons-feather',
            label: 'Feather',
            url: '/components/icons/feather',
            parentKey: 'icons',
          },
          {
            key: 'icons-bootstrap',
            label: 'Bootstrap',
            url: '/components/icons/bootstrap',
            parentKey: 'icons',
          },
          {
            key: 'icons-boxicons',
            label: 'BoxIcons',
            url: '/components/icons/boxicons',
            parentKey: 'icons',
          },
          {
            key: 'icons-fontawesome',
            label: 'Fontawesome',
            url: '/components/icons/fontawesome',
            parentKey: 'icons',
          },
          {
            key: 'icons-lucide',
            label: 'Lucide',
            url: '/components/icons/lucide',
            parentKey: 'icons',
          },
          {
            key: 'icons-tabler ',
            label: 'Tabler',
            url: '/components/icons/tabler',
            parentKey: 'icons',
          },
          {
            key: 'icons-weather',
            label: 'Weather',
            url: '/components/icons/weather',
            parentKey: 'icons',
          },
        ],
      },
      {
        key: 'tables',
        label: 'Tables',
        isTitle: false,
        parentKey: 'component',
        children: [
          {
            key: 'bootstap-table',
            label: 'Bootstrap',
            url: '/components/tables/bootstap-table',
            parentKey: 'tables',
          },
          {
            key: 'react-table',
            label: 'ReactTable',
            url: '/components/tables/react-table',
            parentKey: 'tables',
          },
        ],
      },
      {
        key: 'charts',
        label: 'Charts',
        isTitle: false,
        parentKey: 'component',
        children: [
          {
            key: 'apexcharts',
            label: 'Apexcharts',
            url: '/components/charts/apexcharts',
            parentKey: 'charts',
          },
          {
            key: 'chartjs',
            label: 'ChartJS',
            url: '/components/charts/chartjs',
            parentKey: 'charts',
          },
          {
            key: 'recharts',
            label: 'Recharts',
            url: '/components/charts/recharts',
            parentKey: 'charts',
          },
          {
            key: 'progressbar',
            label: 'Progressbar',
            url: '/components/charts/progressbar',
            parentKey: 'charts',
          },
        ],
      },
      {
        key: 'forms',
        label: 'Forms',
        isTitle: false,
        parentKey: 'component',
        children: [
          {
            key: 'forms-adv-radio',
            label: 'Radios',
            url: '/components/forms/adv-radio',
            parentKey: 'forms',
          },
          {
            key: 'forms-adv-checkbox',
            label: 'Checkboxs',
            url: '/components/forms/adv-checkbox',
            parentKey: 'forms',
          },
          {
            key: 'forms-adv-switch',
            label: 'Switchs',
            url: '/components/forms/adv-switch',
            parentKey: 'forms',
          },
          {
            key: 'forms-elements',
            label: 'Elements',
            url: '/components/forms/elements',
            parentKey: 'forms',
          },
          {
            key: 'forms-validation',
            label: 'Validation',
            url: '/components/forms/validation',
            parentKey: 'forms',
          },
          {
            key: 'forms-inputmask',
            label: 'InputMask',
            url: '/components/forms/inputmask',
            parentKey: 'forms',
          },
          {
            key: 'forms-nouislider',
            label: 'noUiSlider',
            url: '/components/forms/nouislider',
            parentKey: 'forms',
          },
        ],
      },
      {
        key: 'editors',
        label: 'Editors',
        isTitle: false,
        parentKey: 'component',
        children: [
          {
            key: 'editors-quill',
            label: 'Quill',
            url: '/components/editors/quill',
            parentKey: 'editors',
          },
          {
            key: 'editors-tinymce',
            label: 'TinyMCE',
            url: '/components/editors/tinymce',
            parentKey: 'editors',
          },
        ],
      },
      {
        key: 'pickers',
        label: 'Pickers',
        isTitle: false,
        parentKey: 'component',
        children: [
          {
            key: 'pickers-flatpickr',
            label: 'Flatpickr',
            url: '/components/pickers/flatpickr',
            parentKey: 'pickers',
          },
          {
            key: 'pickers-daterangepicker',
            label: 'DateRange',
            url: '/components/pickers/daterangepicker',
            parentKey: 'pickers',
          },
        ],
      },
      {
        key: 'maps',
        label: 'Maps',
        isTitle: false,
        parentKey: 'component',
        children: [
          {
            key: 'maps-vector',
            label: 'Vector',
            url: '/components/maps/vector-maps',
            parentKey: 'maps',
          },
        ],
      },
      {
        key: 'extended',
        label: 'Extended',
        isTitle: false,
        parentKey: 'component',
        children: [
          {
            key: 'extended-react-select',
            label: 'Select2',
            url: '/components/extended/select2',
            parentKey: 'selects',
          },
          {
            key: 'extended-portlets',
            label: 'SweetAlert2',
            url: '/components/extended/sweetalert2',
            parentKey: 'extended',
          },
          {
            key: 'extended-slick',
            label: 'Slick Slider',
            url: '/components/extended/react-slick',
            parentKey: 'extended',
          },
          {
            key: 'extended-dropzone',
            label: 'Dropzone',
            url: '/components/extended/dropzone',
            parentKey: 'extended',
          },
          {
            key: 'extended-hot-toast',
            label: 'Hot Toast',
            url: '/components/extended/hottoast',
            parentKey: 'extended',
          },
          {
            key: 'extended-toastify',
            label: 'Toastify',
            url: '/components/extended/toastify',
            parentKey: 'extended',
          },
        ],
      },
    ],
  },
  {
    key: 'page',
    icon: 'fi fi-rr-browser',
    label: 'UI Pages',
    isTitle: true,
    children: [
      {
        key: 'account',
        label: 'Account',
        isTitle: false,
        parentKey: 'page',
        children: [
          {
            key: 'account-overview',
            label: 'Overview',
            url: '/user-profile/overview',
            parentKey: 'account',
          },
          {
            key: 'account-activity',
            label: 'Activity',
            url: '/user-profile/activity',
            parentKey: 'account',
          },
          {
            key: 'account-followers',
            label: 'Followers',
            url: '/user-profile/followers',
            parentKey: 'account',
          },
          {
            key: 'account-contacts',
            label: 'Contacts',
            url: '/user-profile/contacts',
            parentKey: 'account',
          },
          {
            key: 'account-projects',
            label: 'Projects',
            url: '/user-profile/projects',
            parentKey: 'account',
          },
          {
            key: 'account-gallery',
            label: 'Gallery',
            url: '/user-profile/gallery',
            parentKey: 'account',
          },
        ],
      },
      {
        key: 'settings',
        label: 'Settings',
        isTitle: false,
        parentKey: 'page',
        children: [
          {
            key: 'settings-account',
            label: 'Account',
            url: '/account-settings/account',
            parentKey: 'settings',
          },
          {
            key: 'settings-password-security',
            label: 'Security',
            url: '/account-settings/security',
            parentKey: 'settings',
          },
          {
            key: 'settings-notifications',
            label: 'Notifications',
            url: '/account-settings/notifications',
            parentKey: 'settings',
          },
          {
            key: 'settings-plan-billing',
            label: 'Plan & Billing',
            url: '/account-settings/billing',
            parentKey: 'settings',
          },
          {
            key: 'settings-integrations',
            label: 'Integrations',
            url: '/account-settings/integrations',
            parentKey: 'settings',
          },
        ],
      },
      {
        key: 'other-pages',
        label: 'Other Pages',
        isTitle: false,
        parentKey: 'page',
        children: [
          {
            key: 'other-starter',
            label: 'Starter',
            url: '/other-pages/starter',
            parentKey: 'other-pages',
          },
          {
            key: 'other-faqs',
            label: 'FAQs',
            url: '/other-pages/faqs',
            parentKey: 'other-pages',
          },
          {
            key: 'other-pricing',
            label: 'Pricing',
            url: '/other-pages/pricing',
            parentKey: 'other-pages',
          },
          {
            key: 'other-about-us',
            label: 'About Us',
            url: '/other-pages/about-us',
            parentKey: 'other-pages',
          },
          {
            key: 'other-contact-us',
            label: 'Contact Us',
            url: '/other-pages/contact-us',
            parentKey: 'other-pages',
          },
          {
            key: 'other-privacy-policy',
            label: 'Privacy & Policy',
            url: '/other-pages/privacy-policy',
            parentKey: 'other-pages',
          },
          {
            key: 'other-terms-services',
            label: 'Terms of Services',
            url: '/other-pages/terms-services',
            parentKey: 'other-pages',
          },
        ],
      },
      {
        key: 'auth',
        label: 'Authentication',
        isTitle: false,
        parentKey: 'page',
        children: [
          {
            key: 'auth-login',
            label: 'Login',
            parentKey: 'auth',
            children: [
              {
                key: 'auth-login-minimal',
                label: 'Minimal',
                url: '/auth/minimal/login',
                parentKey: 'auth-login',
              },
              {
                key: 'auth-login-classic',
                label: 'Classic',
                url: '/auth/classic/login',
                parentKey: 'auth-login',
              },
              {
                key: 'auth-login-creative',
                label: 'Creative',
                url: '/auth/creative/login',
                parentKey: 'auth-login',
              },
              {
                key: 'auth-login-corporate',
                label: 'Corporate',
                url: '/auth/corporate/login',
                parentKey: 'auth-login',
              },
              {
                key: 'auth-login-modern',
                label: 'Modern',
                url: '/auth/modern/login',
                parentKey: 'auth-login',
              },
            ],
          },
          {
            key: 'auth-register',
            label: 'Register',
            parentKey: 'auth',
            children: [
              {
                key: 'auth-register-minimal',
                label: 'Minimal',
                url: '/auth/minimal/register',
                parentKey: 'auth-register',
              },
              {
                key: 'auth-register-classic',
                label: 'Classic',
                url: '/auth/classic/register',
                parentKey: 'auth-register',
              },
              {
                key: 'auth-register-creative',
                label: 'Creative',
                url: '/auth/creative/register',
                parentKey: 'auth-register',
              },
              {
                key: 'auth-register-corporate',
                label: 'Corporate',
                url: '/auth/corporate/register',
                parentKey: 'auth-register',
              },
              {
                key: 'auth-register-modern',
                label: 'Modern',
                url: '/auth/modern/register',
                parentKey: 'auth-register',
              },
            ],
          },
          {
            key: 'auth-register-success',
            label: 'Register Success',
            parentKey: 'auth',
            children: [
              {
                key: 'auth-register-minimal-success',
                label: 'Minimal',
                url: '/auth/minimal/register-success',
                parentKey: 'auth-register-success',
              },
              {
                key: 'auth-register-classic-success',
                label: 'Classic',
                url: '/auth/classic/register-success',
                parentKey: 'auth-register-success',
              },
              {
                key: 'auth-register-creative-success',
                label: 'Creative',
                url: '/auth/creative/register-success',
                parentKey: 'auth-register-success',
              },
              {
                key: 'auth-register-corporate-success',
                label: 'Corporate',
                url: '/auth/corporate/register-success',
                parentKey: 'auth-register-success',
              },
              {
                key: 'auth-register-modern-success',
                label: 'Modern',
                url: '/auth/modern/register-success',
                parentKey: 'auth-register-success',
              },
            ],
          },
          {
            key: 'auth-reset-password',
            label: 'Reset Password',
            parentKey: 'auth',
            children: [
              {
                key: 'auth-reset-password-minimal',
                label: 'Minimal',
                url: '/auth/minimal/reset-password',
                parentKey: 'auth-reset-password',
              },
              {
                key: 'auth-reset-password-classic',
                label: 'Classic',
                url: '/auth/classic/reset-password',
                parentKey: 'auth-reset-password',
              },
              {
                key: 'auth-reset-password-creative',
                label: 'Creative',
                url: '/auth/creative/reset-password',
                parentKey: 'auth-reset-password',
              },
              {
                key: 'auth-reset-password-corporate',
                label: 'Corporate',
                url: '/auth/corporate/reset-password',
                parentKey: 'auth-reset-password',
              },
              {
                key: 'auth-reset-password-modern',
                label: 'Modern',
                url: '/auth/modern/reset-password',
                parentKey: 'auth-reset-password',
              },
            ],
          },
          {
            key: 'auth-forgot-password',
            label: 'Forgot Password',
            parentKey: 'auth',
            children: [
              {
                key: 'auth-forgot-password-minimal',
                label: 'Minimal',
                url: '/auth/minimal/forgot-password',
                parentKey: 'auth-forgot-password',
              },
              {
                key: 'auth-forgot-password-classic',
                label: 'Classic',
                url: '/auth/classic/forgot-password',
                parentKey: 'auth-forgot-password',
              },
              {
                key: 'auth-forgot-password-creative',
                label: 'Creative',
                url: '/auth/creative/forgot-password',
                parentKey: 'auth-forgot-password',
              },
              {
                key: 'auth-forgot-password-corporate',
                label: 'Corporate',
                url: '/auth/corporate/forgot-password',
                parentKey: 'auth-forgot-password',
              },
              {
                key: 'auth-forgot-password-modern',
                label: 'Modern',
                url: '/auth/modern/forgot-password',
                parentKey: 'auth-forgot-password',
              },
            ],
          },
          {
            key: 'auth-otp',
            label: 'Two-factor (OTP)',
            parentKey: 'auth',
            children: [
              {
                key: 'auth-otp-minimal',
                label: 'Minimal',
                url: '/auth/minimal/otp',
                parentKey: 'auth-otp',
              },
              {
                key: 'auth-otp-classic',
                label: 'Classic',
                url: '/auth/classic/otp',
                parentKey: 'auth-otp',
              },
              {
                key: 'auth-otp-creative',
                label: 'Creative',
                url: '/auth/creative/otp',
                parentKey: 'auth-otp',
              },
              {
                key: 'auth-otp-corporate',
                label: 'Corporate',
                url: '/auth/corporate/otp',
                parentKey: 'auth-otp',
              },
              {
                key: 'auth-otp-modern',
                label: 'Modern',
                url: '/auth/modern/otp',
                parentKey: 'auth-otp',
              },
            ],
          },
          {
            key: 'auth-lock-screen',
            label: 'Lock Screen',
            parentKey: 'auth',
            children: [
              {
                key: 'auth-lock-screen-minimal',
                label: 'Minimal',
                url: '/auth/minimal/lock-screen',
                parentKey: 'auth-lock-screen',
              },
              {
                key: 'auth-lock-screen-classic',
                label: 'Classic',
                url: '/auth/classic/lock-screen',
                parentKey: 'auth-lock-screen',
              },
              {
                key: 'auth-lock-screen-creative',
                label: 'Creative',
                url: '/auth/creative/lock-screen',
                parentKey: 'auth-lock-screen',
              },
              {
                key: 'auth-lock-screen-corporate',
                label: 'Corporate',
                url: '/auth/corporate/lock-screen',
                parentKey: 'auth-lock-screen',
              },
              {
                key: 'auth-lock-screen-modern',
                label: 'Modern',
                url: '/auth/modern/lock-screen',
                parentKey: 'auth-lock-screen',
              },
            ],
          },
        ],
      },
      {
        key: 'error',
        label: 'Error Pages',
        isTitle: false,
        parentKey: 'page',
        children: [
          {
            key: 'error-not-found',
            label: '404 Not Found',
            url: '/error-pages/not-found',
            parentKey: 'error-pages',
          },
          {
            key: 'error-not-authorized',
            label: '401 Not Authorized',
            url: '/error-pages/not-authorized',
            parentKey: 'error-pages',
          },
          {
            key: 'error-server-error',
            label: '500 Server Error',
            url: '/error-pages/server-error',
            parentKey: 'error-pages',
          },
          {
            key: 'error-comming-soon',
            label: 'Comming Soon',
            url: '/error-pages/comming-soon',
            parentKey: 'error-pages',
          },
          {
            key: 'error-maintenance',
            label: 'Under Maintenance',
            url: '/error-pages/under-maintenance',
            parentKey: 'error-pages',
          },
        ],
      },
      {
        key: 'etemplates',
        label: 'Email Templates',
        isTitle: false,
        parentKey: 'page',
        children: [
          {
            key: 'et-welcome-message',
            label: 'Welcome Message',
            url: '/email-template/et-welcome-message',
            parentKey: 'etemplates',
          },
          {
            key: 'et-confirm-account',
            label: 'Confirm Account',
            url: '/email-template/et-confirm-account',
            parentKey: 'etemplates',
          },
          {
            key: 'et-reset-password',
            label: 'Reset Password',
            url: '/email-template/et-reset-password',
            parentKey: 'etemplates',
          },
          {
            key: 'et-expired-card',
            label: 'Expired Card',
            url: '/email-template/et-expired-card',
            parentKey: 'etemplates',
          },
          {
            key: 'et-coupon-sale',
            label: 'Coupon Sale',
            url: '/email-template/et-coupon-sale',
            parentKey: 'etemplates',
          },
          {
            key: 'et-latest-update',
            label: 'Latest Update',
            url: '/email-template/et-latest-update',
            parentKey: 'etemplates',
          },
        ],
      },
    ],
  },
  {
    key: 'docs',
    label: 'Helpdesk',
    isTitle: true,
    icon: 'fi fi-rr-life-ring',
    children: [
      {
        key: 'support',
        label: 'Support',
        isTitle: false,
        url: '../docs/support.html',
        parentKey: 'docs',
      },
      {
        key: 'changelog',
        label: 'Changelog',
        isTitle: false,
        url: '../docs/changelog.html',
        parentKey: 'docs',
      },
      {
        key: 'documentation',
        label: 'Documentation',
        isTitle: false,
        url: '../docs/documentation.html',
        parentKey: 'docs',
      },
    ],
  },
]
export { HORIZONTAL_MENU_ITEMS }

// Role-based menu configurations
const SUPERADMIN_MENU_ITEMS: MenuItemTypes[] = [
  {
    key: 'navigation',
    label: 'Navigation',
    isTitle: true,
    roles: ['superadmin'],
  },
  {
    key: 'dashboards',
    label: 'Dashboard',
    isTitle: false,
    icon: 'fi fi-rr-dashboard',
    url: '/dashboards/crm',
    roles: ['superadmin'],
  },
  {
    key: 'systemManagement',
    label: 'System Management',
    isTitle: true,
    roles: ['superadmin'],
  },
  {
    key: 'commonMasters',
    label: 'Common Masters',
    isTitle: false,
    icon: 'fi fi-rr-globe',
    roles: ['superadmin'],
    children: [
      {
        key: 'countryMaster',
        label: 'Country Master',
        url: '/apps/country',
        parentKey: 'commonMasters',
        roles: ['superadmin'],
      },
      {
        key: 'stateMaster',
        label: 'State Master',
        url: '/apps/states',
        parentKey: 'commonMasters',
        roles: ['superadmin'],
      },
      {
        key: 'districtMaster',
        label: 'District Master',
        url: '/apps/districts',
        parentKey: 'commonMasters',
        roles: ['superadmin'],
      },
      {
        key: 'zoneMaster',
        label: 'Zone Master',
        url: '/apps/zones',
        parentKey: 'commonMasters',
        roles: ['superadmin'],
      },
       {
        key: 'HotelMaster',
        label: 'HotelMaster',
        url: '/apps/HotelMaster',
        parentKey: 'commonMasters',
        roles: ['superadmin'],
      },
    ],
  },
  {
    key: 'userManagement',
    label: 'User Management',
    isTitle: false,
    icon: 'fi fi-rr-users',
    roles: ['superadmin'],
    children: [
      {
        key: 'ManageAgents',
        label: 'Manage Agents',
        url: '/apps/ManageAgents',
        parentKey: 'userManagement',
        roles: ['superadmin'],
      },
      
      {
        key: 'HotelMasters',
        label: 'Manage Hotels',
        url: '/apps/HotelMasters',
        parentKey: 'userManagement',
        roles: ['superadmin'],
      },

      {
        key: 'permissions',
        label: 'Permissions',
        url: '/apps/permissions',
        parentKey: 'userManagement',
        roles: ['superadmin'],
      },
    ],
  },
  {
    key: 'reports',
    label: 'Reports & Analytics',
    isTitle: false,
    icon: 'fi fi-rr-chart-histogram',
    roles: ['superadmin'],
    children: [
      {
        key: 'systemReports',
        label: 'System Reports',
        url: '/apps/system-reports',
        parentKey: 'reports',
        roles: ['superadmin'],
      },
      {
        key: 'userReports',
        label: 'User Reports',
        url: '/apps/user-reports',
        parentKey: 'reports',
        roles: ['superadmin'],
      },
      {
        key: 'analytics',
        label: 'Analytics',
        url: '/apps/analytics',
        parentKey: 'reports',
        roles: ['superadmin'],
      },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    isTitle: false,
    icon: 'fi fi-rr-settings',
    roles: ['superadmin'],
    children: [
      {
        key: 'systemSettings',
        label: 'System Settings',
        url: '/apps/system-settings',
        parentKey: 'settings',
        roles: ['superadmin'],
      },
      {
        key: 'profile',
        label: 'My Profile',
        url: '/user-profile/overview',
        parentKey: 'settings',
        roles: ['superadmin'],
      },
    ],
  },
]

const AGENT_ADMIN_MENU_ITEMS: MenuItemTypes[] = [
  {
    key: 'navigation',
    label: 'Navigation',
    isTitle: true,
    roles: ['agent', 'admin'],
  },
  {
    key: 'dashboards',
    label: 'Dashboard',
    isTitle: false,
    icon: 'fi fi-rr-dashboard',
    url: '/dashboards/crm',
    roles: ['agent', 'admin'],
  },
  {
    key: 'hotelManagement',
    label: 'Hotel Management',
    isTitle: true,
    roles: ['agent', 'admin'],
  },
  {
    key: 'hotels',
    label: 'My Hotels',
    isTitle: false,
    icon: 'fi fi-rr-building',
    roles: ['agent', 'admin'],
    children: [
      {
        key: 'hotelList',
        label: 'Hotel List',
        url: '/apps/my-hotels',
        parentKey: 'hotels',
        roles: ['agent', 'admin'],
      },
      {
        key: 'addHotel',
        label: 'Add Hotel',
        url: '/apps/add-hotel',
        parentKey: 'hotels',
        roles: ['agent', 'admin'],
      },
      {
        key: 'hotelSettings',
        label: 'Hotel Settings',
        url: '/apps/hotel-settings',
        parentKey: 'hotels',
        roles: ['agent', 'admin'],
      },
    ],
  },
  {
    key: 'bookingManagement',
    label: 'Booking Management',
    isTitle: false,
    icon: 'fi fi-rr-calendar-check',
    roles: ['agent', 'admin'],
    children: [
      {
        key: 'bookings',
        label: 'All Bookings',
        url: '/apps/bookings',
        parentKey: 'bookingManagement',
        roles: ['agent', 'admin'],
      },
      {
        key: 'pendingBookings',
        label: 'Pending Bookings',
        url: '/apps/pending-bookings',
        parentKey: 'bookingManagement',
        roles: ['agent', 'admin'],
      },
      {
        key: 'confirmedBookings',
        label: 'Confirmed Bookings',
        url: '/apps/confirmed-bookings',
        parentKey: 'bookingManagement',
        roles: ['agent', 'admin'],
      },
    ],
  },
  {
    key: 'guestManagement',
    label: 'Guest Management',
    isTitle: false,
    icon: 'fi fi-rr-user',
    roles: ['agent', 'admin'],
    children: [
      {
        key: 'guests',
        label: 'Guest List',
        url: '/apps/guests',
        parentKey: 'guestManagement',
        roles: ['agent', 'admin'],
      },
      {
        key: 'addGuest',
        label: 'Add Guest',
        url: '/apps/add-guest',
        parentKey: 'guestManagement',
        roles: ['agent', 'admin'],
      },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    isTitle: false,
    icon: 'fi fi-rr-chart-histogram',
    roles: ['agent', 'admin'],
    children: [
      {
        key: 'bookingReports',
        label: 'Booking Reports',
        url: '/apps/booking-reports',
        parentKey: 'reports',
        roles: ['agent', 'admin'],
      },
      {
        key: 'revenueReports',
        label: 'Revenue Reports',
        url: '/apps/revenue-reports',
        parentKey: 'reports',
        roles: ['agent', 'admin'],
      },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    isTitle: false,
    icon: 'fi fi-rr-settings',
    roles: ['agent', 'admin'],
    children: [
      {
        key: 'profile',
        label: 'My Profile',
        url: '/user-profile/overview',
        parentKey: 'settings',
        roles: ['agent', 'admin'],
      },
      {
        key: 'accountSettings',
        label: 'Account Settings',
        url: '/account-settings/account',
        parentKey: 'settings',
        roles: ['agent', 'admin'],
      },
    ],
  },
]

const HOTEL_USER_MENU_ITEMS: MenuItemTypes[] = [
  {
    key: 'navigation',
    label: 'Navigation',
    isTitle: true,
    roles: ['hotel', 'user'],
  },
  {
    key: 'dashboards',
    label: 'Dashboard',
    isTitle: false,
    icon: 'fi fi-rr-dashboard',
    url: '/dashboards/crm',
    roles: ['hotel', 'user'],
  },
  {
    key: 'hotelOperations',
    label: 'Hotel Operations',
    isTitle: true,
    roles: ['hotel', 'user'],
  },
  {
    key: 'roomManagement',
    label: 'Room Management',
    isTitle: false,
    icon: 'fi fi-rr-bed',
    roles: ['hotel', 'user'],
    children: [
      {
        key: 'rooms',
        label: 'Room List',
        url: '/apps/rooms',
        parentKey: 'roomManagement',
        roles: ['hotel', 'user'],
      },
      {
        key: 'roomTypes',
        label: 'Room Types',
        url: '/apps/room-types',
        parentKey: 'roomManagement',
        roles: ['hotel', 'user'],
      },
      {
        key: 'roomStatus',
        label: 'Room Status',
        url: '/apps/room-status',
        parentKey: 'roomManagement',
        roles: ['hotel', 'user'],
      },
    ],
  },
  {
    key: 'bookingOperations',
    label: 'Booking Operations',
    isTitle: false,
    icon: 'fi fi-rr-calendar-check',
    roles: ['hotel', 'user'],
    children: [
      {
        key: 'checkIn',
        label: 'Check In',
        url: '/apps/check-in',
        parentKey: 'bookingOperations',
        roles: ['hotel', 'user'],
      },
      {
        key: 'checkOut',
        label: 'Check Out',
        url: '/apps/check-out',
        parentKey: 'bookingOperations',
        roles: ['hotel', 'user'],
      },
      {
        key: 'currentGuests',
        label: 'Current Guests',
        url: '/apps/current-guests',
        parentKey: 'bookingOperations',
        roles: ['hotel', 'user'],
      },
    ],
  },
  {
    key: 'housekeeping',
    label: 'Housekeeping',
    isTitle: false,
    icon: 'fi fi-rr-broom',
    roles: ['hotel', 'user'],
    children: [
      {
        key: 'cleaningSchedule',
        label: 'Cleaning Schedule',
        url: '/apps/cleaning-schedule',
        parentKey: 'housekeeping',
        roles: ['hotel', 'user'],
      },
      {
        key: 'maintenance',
        label: 'Maintenance',
        url: '/apps/maintenance',
        parentKey: 'housekeeping',
        roles: ['hotel', 'user'],
      },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    isTitle: false,
    icon: 'fi fi-rr-chart-histogram',
    roles: ['hotel', 'user'],
    children: [
      {
        key: 'occupancyReport',
        label: 'Occupancy Report',
        url: '/apps/occupancy-report',
        parentKey: 'reports',
        roles: ['hotel', 'user'],
      },
      {
        key: 'dailyReport',
        label: 'Daily Report',
        url: '/apps/daily-report',
        parentKey: 'reports',
        roles: ['hotel', 'user'],
      },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    isTitle: false,
    icon: 'fi fi-rr-settings',
    roles: ['hotel', 'user'],
    children: [
      {
        key: 'profile',
        label: 'My Profile',
        url: '/user-profile/overview',
        parentKey: 'settings',
        roles: ['hotel', 'user'],
      },
      {
        key: 'hotelSettings',
        label: 'Hotel Settings',
        url: '/apps/hotel-settings',
        parentKey: 'settings',
        roles: ['hotel', 'user'],
      },
    ],
  },
]

// Function to get menu items based on user role
export const getMenuItemsByRole = (userRole: string): MenuItemTypes[] => {
  switch (userRole) {
    case 'superadmin':
      return SUPERADMIN_MENU_ITEMS
    case 'agent':
    case 'admin':
      return AGENT_ADMIN_MENU_ITEMS
    case 'hotel':
    case 'user':
      return HOTEL_USER_MENU_ITEMS
    default:
      return MENU_ITEMS // Fallback to original menu
  }
}

// Function to filter menu items by role
export const filterMenuItemsByRole = (menuItems: MenuItemTypes[], userRole: string): MenuItemTypes[] => {
  return menuItems.filter(item => {
    // If no roles specified, allow access
    if (!item.roles || item.roles.length === 0) {
      return true
    }
    // Check if user role is in allowed roles
    return item.roles.includes(userRole)
  }).map(item => ({
    ...item,
    children: item.children ? filterMenuItemsByRole(item.children, userRole) : undefined
  }))
}
