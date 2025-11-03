// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/ui', 'nuxt-nodemailer', '@pinia/nuxt', '@formkit/auto-animate/nuxt'],
  css: ['~/assets/css/tailwind.css'],

  routeRules: {
     "/**":{ssr: false}
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET
  },

  colorMode: {
   classSuffix: '',
    preference: 'system',
    fallback: 'dark'
  },

   nodemailer: {
    from: '',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'alfredebube7@gmail.com',
      pass: '',
    },
  },
})