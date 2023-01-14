module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], 
  theme: {
    screens: {
      "2xsm": "320px", // => @media (min-width: 320px) { ... }
      xsm: "375px", // => @media (min-width: 375px) { ... }
      sm: "640px", // => @media (min-width: 640px) { ... }
      md: "768px", // => @media (min-width: 768px) { ... }
      base: "960px", // => @media (min-width: 960px) { ... }
      lg: "1024px", // => @media (min-width: 1024px) { ... }
      xl: "1280px", // => @media (min-width: 1280px) { ... }
      "2xl": "1536px", // => @media (min-width: 1536px) { ... }
    },
    fontFamily: {
      Inter: ["Inter"],
      SansThai: ["IBM Plex Sans Thai"],
    },
    extend: {
      keyframes: {
        'fadeUp' : {
          '0%' : { transform: 'translateY(5rem)', opacity: '0%'},
          '95%' : { transform: 'translateY(0)' , opacity: '100%'},
          '100%' : { transform: 'translateY(0)', opacity: '100%'}
        },
        'fadeLeft' : {
          '0%' : { transform: 'translateX(2rem)', opacity: '0%'},
          '95%' : { transform: 'translateY(0)' , opacity: '50%'},
          '100%' : { transform: 'translateY(0)', opacity: '100%'}
        },
        'shake' : {
          '25%': {transform: 'translateX(5px)'},
          '50%': {transform: 'translateX(-5px)'},
          '75%': {transform: 'translateX(5px)'},
        },
        'fadeTop':{
          '0%': { opacity: '0', translate: '0 -1rem'},
          '100%' : {opacity: '1', translate: '0 0'}
        },
        'fadeBottom': {
          '0%': { opacity: '1', translate: '0 0'},
          '100%' : {opacity: '0', translate: '0 -1rem'}
        }
      },
      animation: {
        fadeUp: 'fadeUp 1.5s ease-in-out',
        fadeLeft: 'fadeLeft 1.5s ease-in-out',
        shake: 'shake 0.2s',
        fadeTop: 'fadeTop 0.8s ease',
        fadeBottom: 'fadeBottom 0.4s ease'
      }
    }
  }
};
