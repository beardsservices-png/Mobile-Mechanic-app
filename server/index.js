import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import './db.js' // runs migrations + seed

import customersRouter from './routes/customers.js'
import vehiclesRouter  from './routes/vehicles.js'
import jobsRouter      from './routes/jobs.js'
import checkinRouter   from './routes/checkin.js'
import estimatesRouter from './routes/estimates.js'
import invoicesRouter  from './routes/invoices.js'
import mileageRouter   from './routes/mileage.js'
import expensesRouter  from './routes/expenses.js'
import reportsRouter   from './routes/reports.js'
import settingsRouter  from './routes/settings.js'
import aiRouter        from './routes/ai.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const app  = express()
const PORT = process.env.PORT || 3001
const IS_PROD = process.env.NODE_ENV === 'production'

app.use(express.json({ limit: '25mb' }))

if (!IS_PROD) {
  app.use(cors({ origin: ['http://localhost:5174', 'http://localhost:5173'] }))
}

app.use('/api/customers', customersRouter)
app.use('/api/vehicles',  vehiclesRouter)
app.use('/api/jobs',      jobsRouter)
app.use('/api/checkin',   checkinRouter)
app.use('/api/estimates', estimatesRouter)
app.use('/api/invoices',  invoicesRouter)
app.use('/api/mileage',   mileageRouter)
app.use('/api/expenses',  expensesRouter)
app.use('/api/reports',   reportsRouter)
app.use('/api/settings',  settingsRouter)
app.use('/api/ai',        aiRouter)

if (IS_PROD) {
  const distPath = join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('/*splat', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(distPath, 'index.html'))
    }
  })
}

app.listen(PORT, () => {
  console.log(`Pure Mechanic server running on port ${PORT} [${IS_PROD ? 'production' : 'development'}]`)
})
