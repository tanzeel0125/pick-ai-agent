import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, Zap, Brain, Eye, Mic, MessageSquare, RotateCcw, TrendingUp, Mail, MessageCircle } from 'lucide-react';
interface CalculatorInputs {
  monthlyUsers: number;
  sessionsPerDay: number;
  tokensPerSession: number;
  appType: string;
  outputTypes: string[];
  speedVsReasoning: number;
  platforms: string[];
  fineTune: string;
  budgetConcern: string;
  latencyNeeds: string;
  dataCompliance: string;
  contextWindow: string;
  usagePattern: string;
  primaryMarket: string;
  teamSize: string;
  revenueModel: string;
}
interface AIModel {
  name: string;
  costPer1kTokens: number;
  strengths: string[];
  color: string;
  icon: React.ReactNode;
}
const aiModels: AIModel[] = [{
  name: "GPT-4o",
  costPer1kTokens: 0.005,
  strengths: ["Fast", "Vision", "Voice", "Reliable"],
  color: "tech-green",
  icon: <Zap className="w-4 h-4" />
}, {
  name: "Claude 3.5 Sonnet",
  costPer1kTokens: 0.003,
  strengths: ["Reasoning", "Code", "Long context"],
  color: "tech-orange",
  icon: <Brain className="w-4 h-4" />
}, {
  name: "Gemini 1.5 Pro",
  costPer1kTokens: 0.0025,
  strengths: ["Multimodal", "Cost-effective", "Large context"],
  color: "tech-blue",
  icon: <Eye className="w-4 h-4" />
}, {
  name: "GPT-4o Mini",
  costPer1kTokens: 0.00015,
  strengths: ["Ultra fast", "Cheap", "Good for simple tasks"],
  color: "tech-purple",
  icon: <MessageSquare className="w-4 h-4" />
}];
export default function AICalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyUsers: 1000,
    sessionsPerDay: 3,
    tokensPerSession: 1000,
    appType: '',
    outputTypes: [],
    speedVsReasoning: 50,
    platforms: [],
    fineTune: '',
    budgetConcern: '',
    latencyNeeds: '',
    dataCompliance: '',
    contextWindow: '',
    usagePattern: '',
    primaryMarket: '',
    teamSize: '',
    revenueModel: ''
  });
  const [recommendations, setRecommendations] = useState<{
    model: AIModel;
    score: number;
    monthlyCost: number;
  }[]>([]);
  const calculateRecommendations = () => {
    const totalTokensPerMonth = inputs.monthlyUsers * inputs.sessionsPerDay * inputs.tokensPerSession * 30;
    const modelScores = aiModels.map(model => {
      let score = 50; // Base score
      const monthlyCost = totalTokensPerMonth / 1000 * model.costPer1kTokens;

      // App type preferences
      if (inputs.appType === 'chatbot' && model.name.includes('GPT')) score += 20;
      if (inputs.appType === 'voice-assistant' && model.name === 'GPT-4o') score += 25;
      if (inputs.appType === 'vision-app' && (model.name === 'GPT-4o' || model.name === 'Gemini 1.5 Pro')) score += 25;
      if (inputs.appType === 'code-assistant' && model.name === 'Claude 3.5 Sonnet') score += 30;

      // Speed vs reasoning preference
      if (inputs.speedVsReasoning < 30 && model.strengths.includes('Fast')) score += 20;
      if (inputs.speedVsReasoning > 70 && model.strengths.includes('Reasoning')) score += 25;

      // Budget concerns
      if (inputs.budgetConcern === 'yes' && monthlyCost < 100) score += 15;
      if (inputs.budgetConcern === 'yes' && model.name.includes('Mini')) score += 20;

      // Output types
      if (inputs.outputTypes.includes('voice') && model.name === 'GPT-4o') score += 15;
      if (inputs.outputTypes.includes('vision') && (model.name === 'GPT-4o' || model.name === 'Gemini 1.5 Pro')) score += 15;

      // Latency requirements
      if (inputs.latencyNeeds === 'real-time' && model.strengths.includes('Ultra fast')) score += 20;
      if (inputs.latencyNeeds === 'real-time' && model.name === 'GPT-4o Mini') score += 15;
      if (inputs.latencyNeeds === 'batch' && model.name === 'Claude 3.5 Sonnet') score += 10;

      // Data compliance
      if (inputs.dataCompliance === 'strict' && model.name === 'Claude 3.5 Sonnet') score += 15;
      if (inputs.dataCompliance === 'none' && model.name === 'GPT-4o Mini') score += 10;

      // Context window needs
      if (inputs.contextWindow === 'large' && model.strengths.includes('Large context')) score += 20;
      if (inputs.contextWindow === 'large' && model.strengths.includes('Long context')) score += 25;

      // Usage patterns
      if (inputs.usagePattern === 'burst' && model.name.includes('Mini')) score += 15;
      if (inputs.usagePattern === 'steady' && model.name === 'Gemini 1.5 Pro') score += 10;

      // Revenue model considerations
      if (inputs.revenueModel === 'free' && monthlyCost < 50) score += 20;
      if (inputs.revenueModel === 'paid' && model.name === 'GPT-4o') score += 10;

      // Team size considerations
      if (inputs.teamSize === 'solo' && model.strengths.includes('Fast')) score += 10;
      if (inputs.teamSize === 'large' && model.name === 'Claude 3.5 Sonnet') score += 10;

      // Geographic considerations
      if (inputs.primaryMarket === 'global' && model.name === 'GPT-4o') score += 10;
      if (inputs.primaryMarket === 'us' && model.name.includes('GPT')) score += 5;
      return {
        model,
        score: Math.min(100, score),
        monthlyCost
      };
    });
    setRecommendations(modelScores.sort((a, b) => b.score - a.score));
  };
  useEffect(() => {
    calculateRecommendations();
  }, [inputs]);
  const resetCalculator = () => {
    setInputs({
      monthlyUsers: 1000,
      sessionsPerDay: 3,
      tokensPerSession: 1000,
      appType: '',
      outputTypes: [],
      speedVsReasoning: 50,
      platforms: [],
      fineTune: '',
      budgetConcern: '',
      latencyNeeds: '',
      dataCompliance: '',
      contextWindow: '',
      usagePattern: '',
      primaryMarket: '',
      teamSize: '',
      revenueModel: ''
    });
  };
  const handleOutputTypeChange = (type: string, checked: boolean) => {
    setInputs(prev => ({
      ...prev,
      outputTypes: checked ? [...prev.outputTypes, type] : prev.outputTypes.filter(t => t !== type)
    }));
  };
  const handlePlatformChange = (platform: string, checked: boolean) => {
    setInputs(prev => ({
      ...prev,
      platforms: checked ? [...prev.platforms, platform] : prev.platforms.filter(p => p !== platform)
    }));
  };
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 py-16 relative bg-indigo-900">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 mb-6">
              <Calculator className="w-8 h-8" />
              <h1 className="text-4xl md:text-6xl font-bold">Pick the Right AI Agent</h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Find the perfect AI model for your startup. Get cost estimates and recommendations based on your specific needs.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-tech-purple" />
                Tell us about your app
              </CardTitle>
              <CardDescription>
                Answer a few questions to get personalized AI model recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Usage Metrics */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Usage Metrics</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyUsers">Expected Monthly Users</Label>
                    <Input id="monthlyUsers" type="number" value={inputs.monthlyUsers} onChange={e => setInputs(prev => ({
                    ...prev,
                    monthlyUsers: parseInt(e.target.value) || 0
                  }))} placeholder="e.g., 10,000" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionsPerDay">Sessions per User/Day</Label>
                    <Input id="sessionsPerDay" type="number" value={inputs.sessionsPerDay} onChange={e => setInputs(prev => ({
                    ...prev,
                    sessionsPerDay: parseInt(e.target.value) || 0
                  }))} placeholder="e.g., 3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tokens per Session: {inputs.tokensPerSession.toLocaleString()}</Label>
                  <Slider value={[inputs.tokensPerSession]} onValueChange={value => setInputs(prev => ({
                  ...prev,
                  tokensPerSession: value[0]
                }))} max={5000} min={100} step={100} className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    ~{Math.round(inputs.tokensPerSession * 0.75)} words per conversation
                  </div>
                </div>
              </div>

              <Separator />

              {/* Critical Business Factors */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Business Considerations</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Latency requirements?</Label>
                    <Select value={inputs.latencyNeeds} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    latencyNeeds: value
                  }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Response speed needs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real-time">Real-time (&lt;200ms)</SelectItem>
                        <SelectItem value="fast">Fast (&lt;1s)</SelectItem>
                        <SelectItem value="acceptable">Acceptable (&lt;3s)</SelectItem>
                        <SelectItem value="batch">Batch processing OK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Data compliance needs?</Label>
                    <Select value={inputs.dataCompliance} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    dataCompliance: value
                  }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Privacy requirements" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No special requirements</SelectItem>
                        <SelectItem value="gdpr">GDPR compliance</SelectItem>
                        <SelectItem value="strict">Strict (on-premise preferred)</SelectItem>
                        <SelectItem value="healthcare">Healthcare (HIPAA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Context window needs?</Label>
                    <Select value={inputs.contextWindow} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    contextWindow: value
                  }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Conversation length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Short conversations</SelectItem>
                        <SelectItem value="medium">Medium (few pages)</SelectItem>
                        <SelectItem value="large">Large documents</SelectItem>
                        <SelectItem value="massive">Massive (books/codebases)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Usage pattern?</Label>
                    <Select value={inputs.usagePattern} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    usagePattern: value
                  }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Traffic pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="steady">Steady throughout day</SelectItem>
                        <SelectItem value="burst">Burst/peak usage</SelectItem>
                        <SelectItem value="scheduled">Scheduled batches</SelectItem>
                        <SelectItem value="unknown">Unknown/just starting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary market?</Label>
                    <Select value={inputs.primaryMarket} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    primaryMarket: value
                  }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Geographic focus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia-Pacific</SelectItem>
                        <SelectItem value="global">Global</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Team size?</Label>
                    <Select value={inputs.teamSize} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    teamSize: value
                  }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Development team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solo">Solo founder</SelectItem>
                        <SelectItem value="small">Small team (2-5)</SelectItem>
                        <SelectItem value="medium">Medium team (6-15)</SelectItem>
                        <SelectItem value="large">Large team (15+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Revenue model?</Label>
                  <Select value={inputs.revenueModel} onValueChange={value => setInputs(prev => ({
                  ...prev,
                  revenueModel: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="How do you monetize?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free app (ad-supported)</SelectItem>
                      <SelectItem value="freemium">Freemium model</SelectItem>
                      <SelectItem value="paid">Paid app/subscription</SelectItem>
                      <SelectItem value="b2b">B2B/Enterprise</SelectItem>
                      <SelectItem value="unknown">Still figuring out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* App Specifics */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">App Details</h3>
                
                <div className="space-y-2">
                  <Label>What type of app are you building?</Label>
                  <Select value={inputs.appType} onValueChange={value => setInputs(prev => ({
                  ...prev,
                  appType: value
                }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select app type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chatbot">Chatbot / Customer Support</SelectItem>
                      <SelectItem value="voice-assistant">Voice Assistant</SelectItem>
                      <SelectItem value="vision-app">Vision/Image Analysis</SelectItem>
                      <SelectItem value="code-assistant">Code Assistant</SelectItem>
                      <SelectItem value="content-generator">Content Generator</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>AI capabilities needed:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['text', 'voice', 'vision', 'code'].map(type => <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={type} checked={inputs.outputTypes.includes(type)} onCheckedChange={checked => handleOutputTypeChange(type, !!checked)} />
                        <Label htmlFor={type} className="capitalize">{type}</Label>
                      </div>)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Speed vs Deep Reasoning</Label>
                  <div className="space-y-2">
                    <Slider value={[inputs.speedVsReasoning]} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    speedVsReasoning: value[0]
                  }))} max={100} min={0} step={10} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>⚡ Fastest</span>
                      <span>🧠 Deepest Reasoning</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label>Plan to fine-tune?</Label>
                    <RadioGroup value={inputs.fineTune} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    fineTune: value
                  }))}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="finetune-yes" />
                        <Label htmlFor="finetune-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="finetune-no" />
                        <Label htmlFor="finetune-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Budget is tight?</Label>
                    <RadioGroup value={inputs.budgetConcern} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    budgetConcern: value
                  }))}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="budget-yes" />
                        <Label htmlFor="budget-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="budget-no" />
                        <Label htmlFor="budget-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Button onClick={resetCalculator} variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Calculator
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-tech-blue" />
                AI Model Recommendations
              </CardTitle>
              <CardDescription>
                Based on your inputs, here are the best AI models for your startup
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? <div className="space-y-4">
                  {recommendations.map((rec, index) => <Card key={rec.model.name} className={`relative overflow-hidden transition-smooth hover:shadow-lg ${index === 0 ? 'ring-2 ring-tech-purple' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${rec.model.color}/10`}>
                              {rec.model.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{rec.model.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={index === 0 ? "default" : "secondary"}>
                                  {index === 0 ? "🏆 Best Match" : `${rec.score}% match`}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-tech-purple">
                              ${rec.monthlyCost.toFixed(0)}
                            </div>
                            <div className="text-sm text-muted-foreground">per month</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {rec.model.strengths.map(strength => <Badge key={strength} variant="outline" className="text-xs">
                              {strength}
                            </Badge>)}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          ~{(inputs.monthlyUsers * inputs.sessionsPerDay * inputs.tokensPerSession * 30 / 1000000).toFixed(1)}M tokens/month
                          • ${(rec.model.costPer1kTokens * 1000).toFixed(2)} per 1M tokens
                        </div>
                      </CardContent>
                    </Card>)}
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">💡 Pro Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Start with the recommended model and test with real usage</li>
                      <li>• Consider using different models for different features</li>
                      <li>• Monitor actual token usage - estimates can vary ±30%</li>
                      <li>• Most providers offer volume discounts for high usage</li>
                    </ul>
                  </div>
                </div> : <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Fill out the form to see AI model recommendations</p>
                </div>}
            </CardContent>
          </Card>
        </div>

        {/* Mini CTA Banner */}
        <div className="mt-8 rounded-lg p-4" style={{ backgroundColor: '#312E81' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white text-sm font-medium">
              Get a FREE quote to build your AI App
            </p>
            <div className="flex gap-3">
              <Button
                asChild
                size="sm"
                className="bg-tech-green text-black hover:bg-tech-green/90"
              >
                <a href="https://techpacity.agency/contact-us/" target="_blank" rel="noopener noreferrer">
                  <Mail className="w-4 h-4" />
                  Contact Now
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-tech-green text-black hover:bg-tech-green/90"
              >
                <a href="https://wa.link/y9by8s" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}