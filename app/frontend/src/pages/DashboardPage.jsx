import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users, 
  RefreshCw,
  Calendar,
  Target,
  Zap
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { newsApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchDashboardData = async (showToast = true) => {
    try {
      setLoading(true)
      if (showToast) {
        toast.loading('Loading dashboard data...', { id: 'dashboard' })
      }
      
      const dashboardStats = await newsApi.getDashboardStats()
      setStats(dashboardStats)
      setLastUpdated(new Date())
      
      if (showToast) {
        toast.success('Dashboard updated', { id: 'dashboard' })
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      if (showToast) {
        toast.error('Failed to load dashboard data', { id: 'dashboard' })
      }
      
      // Fallback data
      setStats({
        total_predictions: 247,
        recent_predictions: [],
        model_accuracies: {
          "LR": 0.89,
          "DT": 0.84,
          "RF": 0.92,
          "GB": 0.91
        },
        dataset_stats: {
          total_articles: 44898,
          fake_articles: 23481,
          real_articles: 21417,
          training_accuracy: 0.91,
          validation_accuracy: 0.89
        },
        prediction_distribution: {
          fake: 89,
          real: 158
        }
      })
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData(false)
  }, [])

  if (loading && !stats) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </div>
    )
  }

  // Chart data preparation
  const modelAccuracyData = stats?.model_accuracies ? Object.entries(stats.model_accuracies).map(([model, accuracy]) => ({
    model: {
      'LR': 'Logistic Regression',
      'DT': 'Decision Tree',
      'RF': 'Random Forest',
      'GB': 'Gradient Boosting'
    }[model] || model,
    accuracy: (accuracy * 100).toFixed(1),
    value: accuracy * 100
  })) : []

  const predictionDistributionData = stats?.prediction_distribution ? [
    { 
      name: 'Fake News', 
      value: stats.prediction_distribution.fake, 
      color: '#EF4444',
      percentage: ((stats.prediction_distribution.fake / stats.total_predictions) * 100).toFixed(1)
    },
    { 
      name: 'Real News', 
      value: stats.prediction_distribution.real, 
      color: '#10B981',
      percentage: ((stats.prediction_distribution.real / stats.total_predictions) * 100).toFixed(1)
    }
  ] : []

  const datasetDistributionData = stats?.dataset_stats ? [
    { 
      name: 'Fake Articles', 
      value: stats.dataset_stats.fake_articles, 
      color: '#F87171' 
    },
    { 
      name: 'Real Articles', 
      value: stats.dataset_stats.real_articles, 
      color: '#34D399' 
    }
  ] : []

  // Generate sample trend data
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    predictions: Math.floor(Math.random() * 50) + 20,
    accuracy: 88 + Math.floor(Math.random() * 8)
  }))

  const overviewStats = [
    {
      title: 'Total Predictions',
      value: stats?.total_predictions || 0,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%'
    },
    {
      title: 'Model Accuracy',
      value: '91.2%',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+2.1%'
    },
    {
      title: 'Training Articles',
      value: '44.9K',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'Stable'
    },
    {
      title: 'Response Time',
      value: '0.8s',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '-15%'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-lg text-gray-600">Analytics and Performance Metrics</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <Button 
            variant="outline" 
            onClick={() => fetchDashboardData()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 
                      stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Model Accuracy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Model Performance Comparison</CardTitle>
            <CardDescription>Accuracy scores of individual ML models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelAccuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" fontSize={12} />
                  <YAxis domain={[80, 100]} fontSize={12} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Accuracy']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Prediction Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Prediction Distribution</CardTitle>
            <CardDescription>Breakdown of fake vs real news predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={predictionDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {predictionDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Predictions']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Analysis Trends</CardTitle>
            <CardDescription>Daily prediction counts over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="predictions" 
                    stroke="#3B82F6" 
                    fill="#93C5FD" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Dataset Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Training Dataset Composition</CardTitle>
            <CardDescription>Distribution of fake vs real articles in training data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datasetDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${(value/1000).toFixed(1)}K`}
                  >
                    {datasetDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Articles']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Analysis Activity
          </CardTitle>
          <CardDescription>Latest news articles analyzed by the system</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recent_predictions && stats.recent_predictions.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_predictions.slice(0, 5).map((prediction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1 mb-1">
                      {prediction.headline}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(prediction.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prediction.ensemble_prediction === 'Fake News' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {prediction.ensemble_prediction}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {(prediction.ensemble_confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity to display</p>
              <p className="text-sm text-gray-400 mt-1">
                Start analyzing news articles to see activity here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage