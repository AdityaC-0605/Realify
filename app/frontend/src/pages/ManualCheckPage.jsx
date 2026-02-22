import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { 
  FileText, 
  Send, 
  AlertCircle, 
  CheckCircle2,
  Brain,
  Lightbulb
} from 'lucide-react'
import { newsApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import NewsCard from '../components/Newscard'
import toast from 'react-hot-toast'

const ManualCheckPage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Please enter a news title')
      return
    }

    try {
      setLoading(true)
      toast.loading('Analyzing news article...', { id: 'analyze' })
      
      const newsItems = [{
        title: title.trim(),
        content: content.trim()
      }]
      
      const results = await newsApi.analyzeNews(newsItems)
      
      if (results && results.length > 0) {
        const analysisResult = results[0]
        setResult(analysisResult)
        
        // Add to history
        setHistory(prev => [analysisResult, ...prev.slice(0, 4)]) // Keep last 5
        
        toast.success('Analysis completed!', { id: 'analyze' })
      } else {
        toast.error('No results received', { id: 'analyze' })
      }
      
    } catch (error) {
      console.error('Analysis failed:', error)
      toast.error('Analysis failed. Please try again.', { id: 'analyze' })
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setTitle('')
    setContent('')
    setResult(null)
  }

  const loadSample = (sampleData) => {
    setTitle(sampleData.title)
    setContent(sampleData.content)
    setResult(null)
  }

  const sampleArticles = [
    {
      title: "Scientists Discover Revolutionary Cancer Treatment with 100% Success Rate",
      content: "A groundbreaking study published today claims that researchers have developed a miracle cure for all types of cancer. The treatment reportedly shows 100% success rate in trials conducted on over 10,000 patients worldwide. The researchers say this will completely eliminate cancer within the next year."
    },
    {
      title: "Local Government Announces New Infrastructure Development Plan",
      content: "The city council has approved a comprehensive infrastructure development plan worth $50 million. The plan includes road improvements, public transportation upgrades, and new community centers. Construction is scheduled to begin next quarter and will create approximately 500 local jobs."
    },
    {
      title: "Tech Giant Reports Record Quarterly Earnings",
      content: "The technology company announced record-breaking quarterly earnings of $15.2 billion, surpassing analyst expectations by 12%. The strong performance was driven by increased demand for cloud services and artificial intelligence products. CEO stated the company will continue investing in emerging technologies."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Manual News Verification
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Paste any news article and get instant AI-powered authenticity analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                News Article Input
              </CardTitle>
              <CardDescription>
                Enter the title and content of the news article you want to verify
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    News Title *
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter the news headline here..."
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    News Content (Optional)
                  </label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste the full article content here for more accurate analysis..."
                    rows={8}
                    className="resize-vertical"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Including the full article content improves analysis accuracy
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={loading || !title.trim()}
                    className="flex-1"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Analyze Article
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Analysis Result */}
          {result && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Result</h2>
              <NewsCard result={result} showDetails={true} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sample Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Sample Articles
              </CardTitle>
              <CardDescription>
                Try these examples to see how the system works
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleArticles.map((sample, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                      {sample.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {sample.content}
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => loadSample(sample)}
                      className="w-full"
                    >
                      Use This Sample
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis History */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Analysis</CardTitle>
                <CardDescription>
                  Your last {history.length} analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg text-sm">
                      <p className="font-medium line-clamp-2 mb-2">
                        {item.headline}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.ensemble_prediction === 'Fake News' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.ensemble_prediction}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(item.ensemble_confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Analysis Process</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Text preprocessing and cleaning</li>
                    <li>• Feature extraction using TF-IDF</li>
                    <li>• 4 ML models: LR, DT, RF, GB</li>
                    <li>• Ensemble prediction with confidence</li>
                    <li>• Real-time analysis results</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ManualCheckPage
