import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { 
  Radio, 
  Search, 
  RefreshCw, 
  Rss,
  AlertCircle,
  Clock
} from 'lucide-react'
import { newsApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import NewsCard from '../components/Newscard'
import toast from 'react-hot-toast'

const LiveNewsPage = () => {
  const [keyword, setKeyword] = useState('latest news')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchLiveNews = async (searchKeyword = keyword, showToast = true) => {
    try {
      setLoading(true)
      if (showToast) {
        toast.loading('Fetching live news...', { id: 'fetch-news' })
      }
      
      const newsResults = await newsApi.getLiveNews(searchKeyword, 10)
      setResults(newsResults || [])
      setLastUpdated(new Date())
      
      if (showToast) {
        toast.success(`Found ${newsResults?.length || 0} articles`, { id: 'fetch-news' })
      }
      
    } catch (error) {
      console.error('Failed to fetch live news:', error)
      if (showToast) {
        toast.error('Failed to fetch live news. Showing sample data.', { id: 'fetch-news' })
      }
      
      // Fallback to sample data
      setResults([
        {
          headline: "Sample: Technology companies announce breakthrough in AI development",
          predictions: {"LR": "Not A Fake News", "DT": "Not A Fake News", "RF": "Not A Fake News", "GB": "Not A Fake News"},
          confidence_scores: {"LR": 0.87, "DT": 0.82, "RF": 0.91, "GB": 0.89},
          ensemble_prediction: "Not A Fake News",
          ensemble_confidence: 0.87
        }
      ])
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      fetchLiveNews(keyword.trim())
    }
  }

  const handleRefresh = () => {
    fetchLiveNews(keyword, false)
  }

  // Auto-fetch on component mount
  useEffect(() => {
    fetchLiveNews('breaking news', false)
  }, [])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchLiveNews(keyword, false)
      }
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [keyword, loading])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <Radio className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Live News Verification
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Real-time analysis of Google News articles with AI-powered fake news detection
        </p>
      </div>

      {/* Search Interface */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search News
          </CardTitle>
          <CardDescription>
            Enter keywords to fetch and analyze relevant news articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter search keywords (e.g., 'technology', 'politics', 'climate change')"
                className="h-12"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading || !keyword.trim()}
              className="h-12 px-6"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Results</h2>
            <p className="text-gray-600">
              {results.length > 0 ? `Found ${results.length} articles` : 'No articles found'}
            </p>
          </div>
          
          {results.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Rss className="w-4 h-4" />
              Live Feed
            </div>
          )}
        </div>

        {loading && results.length === 0 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Fetching and analyzing news articles..." />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            {results.map((result, index) => (
              <NewsCard key={index} result={result} showDetails={true} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center border-dashed">
            <div className="text-gray-500">
              <Radio className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Articles Found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try searching with different keywords or check your internet connection.
              </p>
              <Button onClick={() => fetchLiveNews('breaking news')}>
                <Search className="w-4 h-4 mr-2" />
                Search Breaking News
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How Live News Analysis Works</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Fetches real-time articles from Google News via SerpAPI</li>
                <li>• Processes each article through 4 trained ML models</li>
                <li>• Provides individual model predictions and ensemble results</li>
                <li>• Shows confidence scores for transparency</li>
                <li>• Updates automatically every 5 minutes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LiveNewsPage
