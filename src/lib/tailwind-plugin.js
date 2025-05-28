const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ addBase }) {
  addBase({
    ':root': {
      '--border': '214.3 31.8% 91.4%',
      '--input': '214.3 31.8% 91.4%',
      '--ring': '221.2 83.2% 53.3%',
      '--background': '0 0% 100%',
      '--foreground': '222.2 84% 4.9%',
      '--primary': '221.2 83.2% 53.3%',
      '--primary-foreground': '210 40% 98%',
      '--secondary': '210 40% 96.1%',
      '--secondary-foreground': '222.2 47.4% 11.2%',
      '--accent': '210 40% 96.1%',
      '--accent-foreground': '222.2 47.4% 11.2%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '210 40% 98%',
      '--muted': '210 40% 96.1%',
      '--muted-foreground': '215.4 16.3% 46.9%',
      '--card': '0 0% 100%',
      '--card-foreground': '222.2 84% 4.9%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '222.2 84% 4.9%',
      '--radius': '0.5rem'
    },
    '.dark': {
      '--background': '222.2 84% 4.9%',
      '--foreground': '0 0% 100%',  /* Pure white for maximum contrast */
      '--card': '222.2 84% 4.9%',
      '--card-foreground': '0 0% 100%',  /* Pure white for maximum contrast */
      '--popover': '222.2 84% 4.9%',
      '--popover-foreground': '0 0% 100%',  /* Pure white for maximum contrast */
      '--primary': '217.2 91.2% 59.8%',
      '--primary-foreground': '0 0% 0%',  /* Black for contrast on primary buttons */
      '--secondary': '217.2 32.6% 17.5%',
      '--secondary-foreground': '0 0% 100%',  /* Pure white for maximum contrast */
      '--muted': '217.2 32.6% 17.5%',
      '--muted-foreground': '0 0% 90%',  /* Lighter color for muted text */
      '--accent': '217.2 32.6% 17.5%',
      '--accent-foreground': '0 0% 100%',  /* Pure white for maximum contrast */
      '--destructive': '0 62.8% 30.6%',
      '--destructive-foreground': '0 0% 100%',  /* Pure white for maximum contrast */
      '--border': '217.2 32.6% 17.5%',
      '--input': '217.2 32.6% 17.5%',
      '--ring': '224.3 76.3% 48%',
    }
  });
});
