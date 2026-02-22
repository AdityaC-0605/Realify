import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { 
  Shield, 
  Radio, 
  FileText, 
  BarChart3, 
  Brain, 
  Zap, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Users
} from 'lucide-react'
import { newsApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import NewsCard from '../components/Newscard'

const HomePage = () => {
  const [recentNews, setRecentNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        
        // Fetch recent news analysis
        const newsResults = await newsApi.getLiveNews('breaking news', 3)
        setRecentNews(newsResults || [])
        
        // Fetch dashboard stats
        const dashboardStats = await newsApi.getDashboardStats()
        setStats(dashboardStats)
        
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
        // Set fallback data
        setRecentNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Uses 4 advanced ML models: Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting.',
      link: '/manual-check'
    },
    {
      icon: Radio,
      title: 'Real-time News Verification',
      description: 'Fetches and analyzes live news from Google News using SerpAPI integration.',
      link: '/live-news'
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Dashboard',
      description: 'Track model performance, prediction statistics, and analysis history.',
      link: '/dashboard'
    },
    {
      icon: Shield,
      title: 'High Accuracy',
      description: 'Ensemble approach achieves 91%+ accuracy with confidence scoring.',
      link: '/dashboard'
    }
  ]

  const quickStats = [
    { 
      label: 'Model Accuracy', 
      value: '91%', 
      icon: TrendingUp,
      color: 'text-green-600'
    },
    { 
      label: 'ML Models', 
      value: '4', 
      icon: Brain,
      color: 'text-purple-600'
    },
    { 
      label: 'Total Predictions', 
      value: stats?.total_predictions || '0', 
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    { 
      label: 'Real-time Analysis', 
      value: 'Live', 
      icon: Zap,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-16 fade-up">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-2xl shadow-xl shadow-sky-200">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">Realify</span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          AI-powered fake news detection system that helps you verify information before believing it. 
          <br />
          <span className="text-sky-700 font-semibold">Verify Before You Believe</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white">
            <Link to="/live-news">
              <Radio className="w-5 h-5 mr-2" />
              Try Live News Analysis
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/manual-check">
              <FileText className="w-5 h-5 mr-2" />
              Manual Verification
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="text-center hover:shadow-md transition-all hover:-translate-y-0.5 bg-white/90">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent News Analysis */}
      <div className="mb-16 fade-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Recent News Analysis</h2>
            <p className="text-slate-600">Latest news articles analyzed for authenticity</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/live-news">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Fetching latest news analysis..." />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            {recentNews.length > 0 ? (
              recentNews.slice(0, 3).map((result, index) => (
                <NewsCard key={index} result={result} showDetails={false} />
              ))
            ) : (
              <Card className="p-8 text-center bg-white/90">
                <div className="text-slate-500">
                  <Radio className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No recent news analysis available.</p>
                  <Button asChild className="mt-4">
                    <Link to="/live-news">Start Live Analysis</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Advanced machine learning technology to detect fake news with high accuracy
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white/90">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-100 to-amber-100 rounded-lg group-hover:from-sky-200 group-hover:to-amber-200 transition-colors">
                      <Icon className="w-6 h-6 text-sky-700" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={feature.link}>
                      Explore <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-sky-50 to-amber-50 rounded-2xl p-8 mb-16 border border-white/60 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our sophisticated AI system analyzes news articles through multiple layers of verification
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 mx-auto">
              <span className="text-2xl font-bold text-sky-700">1</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Input Analysis</h3>
            <p className="text-slate-600">
              Enter news text or fetch live articles from trusted sources
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 mx-auto">
              <span className="text-2xl font-bold text-sky-700">2</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">ML Processing</h3>
            <p className="text-slate-600">
              4 trained models analyze linguistic patterns and content structure
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 mx-auto">
              <span className="text-2xl font-bold text-sky-700">3</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Results & Confidence</h3>
            <p className="text-slate-600">
              Get predictions with confidence scores and detailed analysis
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-sky-600 to-cyan-500 rounded-2xl p-8 text-white shadow-lg shadow-sky-200">
        <h2 className="text-3xl font-bold mb-4">Ready to Verify News?</h2>
        <p className="text-xl mb-6 text-cyan-100">
          Start analyzing news articles with our AI-powered detection system
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link to="/manual-check">
              Start Manual Check
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sky-700">
            <Link to="/live-news">
              Analyze Live News
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
