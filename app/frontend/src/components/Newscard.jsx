import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { formatConfidence, getConfidenceColor, getPredictionColor } from '../lib/utils'
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

const NewsCard = ({ result, showDetails = true }) => {
  const isFake = result.ensemble_prediction === 'Fake News'

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-relaxed font-medium text-gray-900 flex-1">
            {result.headline}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isFake ? (
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
          </div>
        </div>

        {result.content && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {result.content}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Ensemble Result</span>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPredictionColor(result.ensemble_prediction)}`}>
                {result.ensemble_prediction}
              </div>
              <div className={`text-xs font-semibold mt-1 ${getConfidenceColor(result.ensemble_confidence)}`}>
                {formatConfidence(result.ensemble_confidence)} confidence
              </div>
            </div>
          </div>
        </div>

        {showDetails && result.predictions && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Individual Models</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(result.predictions).map(([model, prediction]) => {
                const confidence = result.confidence_scores?.[model] || 0
                const modelNames = {
                  LR: 'Logistic Regression',
                  DT: 'Decision Tree',
                  RF: 'Random Forest',
                  GB: 'Gradient Boosting'
                }

                return (
                  <div key={model} className="p-2 bg-white border rounded-lg">
                    <div className="text-xs font-medium text-gray-600 mb-1">
                      {modelNames[model] || model}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded text-center font-medium ${getPredictionColor(prediction)}`}>
                      {prediction === 'Fake News' ? 'Fake' : 'Real'}
                    </div>
                    <div className={`text-xs text-center mt-1 font-semibold ${getConfidenceColor(confidence)}`}>
                      {formatConfidence(confidence)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NewsCard
