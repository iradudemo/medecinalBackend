module.exports = {
  clientId: process.env.PAYBACK_API_KEY,
  clientSecret: process.env.PAYBACK_API_SECRET,
  authUrl: "https://payments.paypack.rw/api/auth/agents/authorize",
  paymentUrl: "https://payments.paypack.rw/api/transactions/cashin",
};
