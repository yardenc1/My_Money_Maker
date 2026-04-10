import React, { useMemo, useState, useEffect } from 'react'
import { fetchTransactions, createTransaction } from './api'
import { AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { Wallet, TrendingUp, Landmark, CreditCard, PlusCircle, Activity, MessageCircle, GraduationCap } from 'lucide-react'

const baseline = {
  profile : {
    title : 'M.Sc. Data Science Student',
    workMode : 'Half-time work | Half-time studies',
    hourlyRate : 125,
    netSalary : 7000,
    annualScholarship : 20000,
    annualTuition : 10000,
  },
  assets : {
    meitavTrade : 18000,
    bankSavings : 9000,
    availableCash : 3000,
  },
}

const monthlyTrendSeed = [
  { month : 'Nov', income : 7000, expenses : 4300, invested : 900, cash : 29000 },
  { month : 'Dec', income : 7000, expenses : 4600, invested : 1000, cash : 30100 },
  { month : 'Jan', income : 7000, expenses : 5100, invested : 700, cash : 31300 },
  { month : 'Feb', income : 8666, expenses : 4900, invested : 1300, cash : 32700 },
  { month : 'Mar', income : 7000, expenses : 4700, invested : 1000, cash : 33900 },
  { month : 'Apr', income : 7000, expenses : 4200, invested : 1200, cash : 30000 },
]

const colors = ['#0f172a', '#2563eb', '#38bdf8']

function currency(n) {
  return new Intl.NumberFormat('he-IL', {
    style : 'currency',
    currency : 'ILS',
    maximumFractionDigits : 0,
  }).format(n)
}

function metricColor(value) {
  if (value > 0) return '#059669'
  if (value < 0) return '#e11d48'
  return '#475569'
}

const cardStyle = {
  background : '#ffffff',
  borderRadius : '24px',
  padding : '24px',
  boxShadow : '0 1px 3px rgba(15, 23, 42, 0.08)',
  border : '1px solid #e2e8f0',
}

export default function PersonalFinanceBIDashboard() {
  const [transactions, setTransactions] = useState([])
  const [quickInput, setQuickInput] = useState('Salary received : 7000')

  useEffect(() => {
    const load = async () => {
      const data = await fetchTransactions()
      const mapped = data.map((t) => ({
        id : t.id,
        type : t.transaction_type,
        label : t.raw_text,
        amount : t.amount,
        channel : t.category,
        date : t.created_at,
      }))
      setTransactions(mapped)
    }

    load()
  }, [])

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const toMeitav = transactions.filter((t) => t.label.toLowerCase().includes('meitav')).reduce((s, t) => s + t.amount, 0)
    const toSavings = transactions.filter((t) => t.label.toLowerCase().includes('saving') || t.label.toLowerCase().includes('חיסכון')).reduce((s, t) => s + t.amount, 0)

    const meitavTrade = baseline.assets.meitavTrade + toMeitav
    const bankSavings = baseline.assets.bankSavings + toSavings
    const availableCash = baseline.assets.availableCash + income - expenses - toMeitav - toSavings
    const totalAssets = meitavTrade + bankSavings + availableCash
    const monthlyScholarship = Math.round(baseline.profile.annualScholarship / 12)
    const monthlyTuitionLoad = Math.round(baseline.profile.annualTuition / 12)
    const netFlow = income - expenses
    const savingsRate = income > 0 ? Math.round((netFlow / income) * 100) : 0

    return {
      income,
      expenses,
      toMeitav,
      toSavings,
      meitavTrade,
      bankSavings,
      availableCash,
      totalAssets,
      monthlyScholarship,
      monthlyTuitionLoad,
      netFlow,
      savingsRate,
    }
  }, [transactions])

  const assetMix = [
    { name : 'Meitav Trade', value : totals.meitavTrade },
    { name : 'Bank Savings', value : totals.bankSavings },
    { name : 'Available Cash', value : Math.max(totals.availableCash, 0) },
  ]

  const addTransaction = async () => {
    const raw = quickInput.trim()
    if (!raw) return

    await createTransaction(raw)

    const updated = await fetchTransactions()
    const mapped = updated.map((t) => ({
      id : t.id,
      type : t.transaction_type,
      label : t.raw_text,
      amount : t.amount,
      channel : t.category,
      date : t.created_at,
    }))

    setTransactions(mapped)
    setQuickInput('')
  }

  return (
    <div style={{ minHeight : '100vh', background : '#f8fafc', padding : '24px', fontFamily : 'Arial, sans-serif' }}>
      <div style={{ maxWidth : '1400px', margin : '0 auto', display : 'grid', gap : '24px' }}>
        <div style={{ ...cardStyle, display : 'flex', justifyContent : 'space-between', gap : '24px', flexWrap : 'wrap' }}>
          <div>
            <h1 style={{ margin : 0, fontSize : '32px', color : '#0f172a' }}>Personal Finance Control Center</h1>
            <p style={{ marginTop : '8px', color : '#475569', maxWidth : '780px' }}>
              A private browser dashboard for tracking salary, scholarship, tuition load, Meitav Trade, bank savings, cash flow, and chat-based transaction updates.
            </p>
          </div>

          <div style={{ display : 'grid', gridTemplateColumns : 'repeat(4, minmax(140px, 1fr))', gap : '12px', flex : '1 1 520px' }}>
            <div style={{ ...cardStyle, padding : '16px', background : '#f8fafc' }}>
              <div style={{ display : 'flex', gap : '8px', alignItems : 'center', fontSize : '14px', color : '#475569' }}><GraduationCap size={16} /> Tuition</div>
              <div style={{ marginTop : '8px', fontSize : '22px', fontWeight : 700 }}>{currency(baseline.profile.annualTuition)}</div>
            </div>
            <div style={{ ...cardStyle, padding : '16px', background : '#f8fafc' }}>
              <div style={{ display : 'flex', gap : '8px', alignItems : 'center', fontSize : '14px', color : '#475569' }}><Wallet size={16} /> Salary</div>
              <div style={{ marginTop : '8px', fontSize : '22px', fontWeight : 700 }}>{currency(baseline.profile.netSalary)}</div>
            </div>
            <div style={{ ...cardStyle, padding : '16px', background : '#f8fafc' }}>
              <div style={{ display : 'flex', gap : '8px', alignItems : 'center', fontSize : '14px', color : '#475569' }}><Landmark size={16} /> Scholarship</div>
              <div style={{ marginTop : '8px', fontSize : '22px', fontWeight : 700 }}>{currency(baseline.profile.annualScholarship)}</div>
            </div>
            <div style={{ ...cardStyle, padding : '16px', background : '#f8fafc' }}>
              <div style={{ display : 'flex', gap : '8px', alignItems : 'center', fontSize : '14px', color : '#475569' }}><Activity size={16} /> Hourly Rate</div>
              <div style={{ marginTop : '8px', fontSize : '22px', fontWeight : 700 }}>{currency(baseline.profile.hourlyRate)}</div>
            </div>
          </div>
        </div>

        <div style={{ display : 'grid', gridTemplateColumns : 'repeat(4, minmax(220px, 1fr))', gap : '16px' }}>
          {[
            { title : 'Monthly Income', value : currency(totals.income), icon : Wallet, hint : 'Salary + scholarship + refunds' },
            { title : 'Monthly Expenses', value : currency(totals.expenses), icon : CreditCard, hint : 'Credit + direct expenses' },
            { title : 'Net Monthly Flow', value : currency(totals.netFlow), icon : TrendingUp, hint : `${totals.savingsRate}% savings rate`, color : metricColor(totals.netFlow) },
            { title : 'Total Assets', value : currency(totals.totalAssets), icon : Landmark, hint : 'Trade + savings + available cash' },
          ].map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} style={cardStyle}>
                <div style={{ display : 'flex', justifyContent : 'space-between', alignItems : 'center' }}>
                  <div style={{ fontSize : '14px', fontWeight : 600, color : '#475569' }}>{card.title}</div>
                  <div style={{ borderRadius : '16px', background : '#f1f5f9', padding : '8px' }}><Icon size={16} color='#334155' /></div>
                </div>
                <div style={{ marginTop : '16px', fontSize : '32px', fontWeight : 700, color : card.color || '#0f172a' }}>{card.value}</div>
                <div style={{ marginTop : '8px', fontSize : '12px', color : '#64748b' }}>{card.hint}</div>
              </div>
            )
          })}
        </div>

        <div style={{ display : 'grid', gridTemplateColumns : '2fr 1fr', gap : '24px' }}>
          <div style={cardStyle}>
            <h2 style={{ marginTop : 0 }}>Income vs Expenses Trend</h2>
            <div style={{ height : '320px' }}>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={monthlyTrendSeed}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip formatter={(value) => currency(value)} />
                  <Legend />
                  <Area type='monotone' dataKey='income' fillOpacity={0.15} strokeWidth={2} />
                  <Area type='monotone' dataKey='expenses' fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop : 0 }}>Asset Allocation</h2>
            <div style={{ height : '320px' }}>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie data={assetMix} dataKey='value' nameKey='name' innerRadius={70} outerRadius={110} paddingAngle={3}>
                    {assetMix.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => currency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ display : 'grid', gridTemplateColumns : '2fr 1fr', gap : '24px' }}>
          <div style={cardStyle}>
            <h2 style={{ marginTop : 0 }}>Assets and Contributions</h2>
            <div style={{ display : 'grid', gridTemplateColumns : 'repeat(3, 1fr)', gap : '16px', marginBottom : '24px' }}>
              <div style={{ ...cardStyle, padding : '20px', background : '#f8fafc' }}>
                <div style={{ fontSize : '14px', color : '#64748b' }}>To Meitav Trade</div>
                <div style={{ marginTop : '10px', fontSize : '30px', fontWeight : 700 }}>{currency(totals.toMeitav)}</div>
              </div>
              <div style={{ ...cardStyle, padding : '20px', background : '#f8fafc' }}>
                <div style={{ fontSize : '14px', color : '#64748b' }}>To Bank Savings</div>
                <div style={{ marginTop : '10px', fontSize : '30px', fontWeight : 700 }}>{currency(totals.toSavings)}</div>
              </div>
              <div style={{ ...cardStyle, padding : '20px', background : '#f8fafc' }}>
                <div style={{ fontSize : '14px', color : '#64748b' }}>Tuition Load / Month</div>
                <div style={{ marginTop : '10px', fontSize : '30px', fontWeight : 700 }}>{currency(totals.monthlyTuitionLoad)}</div>
              </div>
            </div>
            <div style={{ height : '300px' }}>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={monthlyTrendSeed}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip formatter={(value) => currency(value)} />
                  <Legend />
                  <Line type='monotone' dataKey='cash' strokeWidth={3} dot={{ r : 4 }} />
                  <Line type='monotone' dataKey='invested' strokeWidth={3} dot={{ r : 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop : 0 }}>Chat and WhatsApp Input</h2>
            <input
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder='Type an update...'
              style={{ width : '100%', borderRadius : '16px', border : '1px solid #cbd5e1', padding : '12px 14px', fontSize : '14px', boxSizing : 'border-box' }}
            />
            <button
              onClick={addTransaction}
              style={{ width : '100%', marginTop : '8px', borderRadius : '16px', border : 'none', background : '#0f172a', color : '#ffffff', padding : '12px 14px', fontWeight : 600, cursor : 'pointer', display : 'flex', alignItems : 'center', justifyContent : 'center', gap : '8px' }}
            >
              <PlusCircle size={16} /> Add transaction
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop : 0 }}>Transaction Feed</h2>
          <div style={{ display : 'grid', gap : '12px', maxHeight : '360px', overflowY : 'auto' }}>
            {transactions.map((t) => (
              <div key={t.id} style={{ display : 'flex', alignItems : 'center', justifyContent : 'space-between', borderRadius : '24px', border : '1px solid #e2e8f0', padding : '16px' }}>
                <div>
                  <div style={{ fontWeight : 600, color : '#0f172a' }}>{t.label}</div>
                  <div style={{ marginTop : '4px', fontSize : '12px', color : '#64748b' }}>{t.date} | {t.channel}</div>
                </div>
                <div style={{ fontSize : '18px', fontWeight : 700, color : t.type === 'income' ? '#059669' : t.type === 'expense' ? '#e11d48' : '#0284c7' }}>
                  {t.type === 'income' ? '+' : '-'}{currency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
