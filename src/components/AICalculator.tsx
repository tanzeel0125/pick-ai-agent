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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from '@/components/ui/drawer';
import { Calculator, Zap, Brain, Eye, Mic, MessageSquare, RotateCcw, TrendingUp, Mail, MessageCircle, Info, ChevronUp } from 'lucide-react';
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
    monthlyUsers: 0,
    sessionsPerDay: 0,
    tokensPerSession: 0,
    appType: '',
    outputTypes: [],
    speedVsReasoning: 0,
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasSeenResults, setHasSeenResults] = useState(false);
  const hasUserInput = () => {
    return inputs.monthlyUsers > 0 || inputs.sessionsPerDay > 0 || inputs.tokensPerSession > 0 || inputs.appType !== '' || inputs.outputTypes.length > 0 || inputs.speedVsReasoning > 0 || inputs.fineTune !== '' || inputs.budgetConcern !== '' || inputs.latencyNeeds !== '' || inputs.dataCompliance !== '' || inputs.contextWindow !== '' || inputs.usagePattern !== '' || inputs.primaryMarket !== '' || inputs.teamSize !== '' || inputs.revenueModel !== '';
  };
  const calculateRecommendations = () => {
    if (!hasUserInput()) {
      setRecommendations([]);
      return;
    }
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
  useEffect(() => {
    if (hasUserInput() && recommendations.length > 0 && !hasSeenResults) {
      setHasSeenResults(true);
    }
  }, [recommendations, hasUserInput]);
  const resetCalculator = () => {
    setInputs({
      monthlyUsers: 0,
      sessionsPerDay: 0,
      tokensPerSession: 0,
      appType: '',
      outputTypes: [],
      speedVsReasoning: 0,
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
  const getValidationHint = (field: string, value: number) => {
    if (field === 'monthlyUsers') {
      if (value === 0) return '';
      if (value < 1000) return '🟢 Small app - Great for MVP';
      if (value < 10000) return '🟡 Medium app - Consider scaling';
      return '🔴 Large app - Enterprise-level planning needed';
    }
    if (field === 'sessionsPerDay') {
      if (value === 0) return '';
      if (value < 2) return '🟢 Low engagement';
      if (value < 5) return '🟡 Medium engagement';
      return '🔴 High engagement - Premium features needed';
    }
    return '';
  };
  return <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden" style={{
        backgroundColor: '#7C3CEC'
      }}>
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 mb-6">
                
                <h1 className="text-4xl md:text-6xl font-bold">Pick the Right AI Agent</h1>
              </div>
              <p className="md:text-2xl text-white/90 max-w-3xl mx-auto text-base">Get cost estimates and recommendations based on your specific needs.</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form - Black Background */}
          <Card className="shadow-card bg-black border-tech-green/20 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-tech-green" />
                Tell us about your app
              </CardTitle>
              <CardDescription>
                Answer a few questions to get personalized AI model recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Usage Metrics */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Usage Metrics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyUsers">Expected Monthly Users</Label>
                    <Input id="monthlyUsers" type="number" value={inputs.monthlyUsers} onChange={e => setInputs(prev => ({
                      ...prev,
                      monthlyUsers: parseInt(e.target.value) || 0
                    }))} placeholder="e.g., 10,000" className="h-11 md:h-10" />
                    {getValidationHint('monthlyUsers', inputs.monthlyUsers) && <p className="text-xs text-muted-foreground">{getValidationHint('monthlyUsers', inputs.monthlyUsers)}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionsPerDay">Sessions per User/Day</Label>
                    <Input id="sessionsPerDay" type="number" value={inputs.sessionsPerDay} onChange={e => setInputs(prev => ({
                      ...prev,
                      sessionsPerDay: parseInt(e.target.value) || 0
                    }))} placeholder="e.g., 3" className="h-11 md:h-10" />
                    {getValidationHint('sessionsPerDay', inputs.sessionsPerDay) && <p className="text-xs text-muted-foreground">{getValidationHint('sessionsPerDay', inputs.sessionsPerDay)}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Tokens per Session</Label>
                    <span className="text-sm font-semibold text-primary">{inputs.tokensPerSession.toLocaleString()}</span>
                  </div>
                  <Slider value={[inputs.tokensPerSession]} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    tokensPerSession: value[0]
                  }))} max={5000} min={0} step={100} className="w-full" />
                  <div className="text-xs text-muted-foreground">
                    ~{Math.round(inputs.tokensPerSession * 0.75)} words per conversation
                  </div>
                </div>
              </div>

              <Separator />

              {/* Critical Business Factors */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Business Considerations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Latency requirements?</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">How fast does your app need to respond? Real-time apps need ultra-fast models.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select value={inputs.latencyNeeds} onValueChange={value => setInputs(prev => ({
                      ...prev,
                      latencyNeeds: value
                    }))}>
                      <SelectTrigger className="h-11 md:h-10">
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
                      <SelectTrigger className="h-11 md:h-10">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Context window needs?</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">How much text does your AI need to process at once? Large documents need bigger context windows.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select value={inputs.contextWindow} onValueChange={value => setInputs(prev => ({
                      ...prev,
                      contextWindow: value
                    }))}>
                      <SelectTrigger className="h-11 md:h-10">
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
                      <SelectTrigger className="h-11 md:h-10">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Primary market?</Label>
                    <Select value={inputs.primaryMarket} onValueChange={value => setInputs(prev => ({
                      ...prev,
                      primaryMarket: value
                    }))}>
                      <SelectTrigger className="h-11 md:h-10">
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
                      <SelectTrigger className="h-11 md:h-10">
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
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">App Details</h3>
                
                <div className="space-y-2">
                  <Label>What type of app are you building?</Label>
                  <Select value={inputs.appType} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    appType: value
                  }))}>
                    <SelectTrigger className="h-11 md:h-10">
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
                  <div className="grid grid-cols-2 gap-4">
                    {['text', 'voice', 'vision', 'code'].map(type => <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={type} checked={inputs.outputTypes.includes(type)} onCheckedChange={checked => handleOutputTypeChange(type, !!checked)} className="h-5 w-5" />
                        <Label htmlFor={type} className="capitalize cursor-pointer">{type}</Label>
                      </div>)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Speed vs Deep Reasoning</Label>
                    <span className="text-sm font-semibold text-primary">{inputs.speedVsReasoning}%</span>
                  </div>
                  <Slider value={[inputs.speedVsReasoning]} onValueChange={value => setInputs(prev => ({
                    ...prev,
                    speedVsReasoning: value[0]
                  }))} max={100} min={0} step={10} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>⚡ Fastest</span>
                    <span>🧠 Deepest Reasoning</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Plan to fine-tune?</Label>
                    <RadioGroup value={inputs.fineTune} onValueChange={value => setInputs(prev => ({
                      ...prev,
                      fineTune: value
                    }))}>
                      <div className="flex items-center space-x-2 h-11 md:h-auto">
                        <RadioGroupItem value="yes" id="finetune-yes" className="h-5 w-5" />
                        <Label htmlFor="finetune-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2 h-11 md:h-auto">
                        <RadioGroupItem value="no" id="finetune-no" className="h-5 w-5" />
                        <Label htmlFor="finetune-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Budget is tight?</Label>
                    <RadioGroup value={inputs.budgetConcern} onValueChange={value => setInputs(prev => ({
                      ...prev,
                      budgetConcern: value
                    }))}>
                      <div className="flex items-center space-x-2 h-11 md:h-auto">
                        <RadioGroupItem value="yes" id="budget-yes" className="h-5 w-5" />
                        <Label htmlFor="budget-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2 h-11 md:h-auto">
                        <RadioGroupItem value="no" id="budget-no" className="h-5 w-5" />
                        <Label htmlFor="budget-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Button onClick={resetCalculator} variant="outline" className="w-full h-11 md:h-10">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Calculator
              </Button>
            </CardContent>
          </Card>

          {/* Results - Desktop View */}
          <Card className="shadow-card bg-neutral-800/50 border-neutral-700 hidden lg:block">
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
                  {recommendations.map((rec, index) => <Card key={rec.model.name} className={`relative overflow-hidden transition-smooth hover:shadow-lg ${index === 0 ? 'ring-2 ring-tech-green' : ''}`}>
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
                            <div className="text-2xl font-bold text-tech-green">
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
                </div> : <div className="text-center py-16 text-muted-foreground">
                  <p className="text-xl font-bold">Once you enter your app details, recommended AI Agents will show here</p>
                </div>}
            </CardContent>
          </Card>

          {/* Results - Mobile Peek Preview Drawer */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              {/* Peek Preview - Always Visible */}
              <div className={`bg-[#333333] border-t-2 border-gray-600 rounded-t-xl shadow-2xl transition-all duration-500 cursor-pointer ${hasUserInput() && !drawerOpen ? 'translate-y-0 animate-bounce-gentle' : !hasUserInput() ? 'translate-y-[calc(100%-60px)]' : 'translate-y-0'}`} onClick={() => hasUserInput() && setDrawerOpen(true)}>
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2 bg-neutral-900">
                  <div className="w-12 h-1.5 bg-gray-500 rounded-full" />
                </div>
                
                {/* Peek Content */}
                <div className="px-4 pb-4 bg-neutral-900">
                  {hasUserInput() && recommendations.length > 0 ? <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">
                          {recommendations.length} AI Models Found
                        </span>
                        <ChevronUp className="w-5 h-5 text-tech-blue animate-bounce" />
                      </div>
                      
                      {/* Mini Preview of Top Recommendation */}
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-700 bg-neutral-900">
                        <div className={`p-2 rounded-lg bg-${recommendations[0].model.color}/10 flex-shrink-0`}>
                          {recommendations[0].model.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate text-white">
                            🏆 {recommendations[0].model.name}
                          </div>
                          <div className="text-xs text-gray-300">
                            Best match for your needs
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-tech-green">
                            ${recommendations[0].monthlyCost.toFixed(0)}
                          </div>
                          <div className="text-xs text-gray-300">per month</div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-center text-gray-300 mt-3">
                        👆 Tap or drag up to view all recommendations
                      </p>
                    </> : <div className="text-center py-2">
                      <p className="text-sm text-gray-300">
                        Fill the form to see AI recommendations
                      </p>
                    </div>}
                </div>
              </div>

              {/* Full Drawer Content */}
              <DrawerContent className="max-h-[85vh] bg-[#333333] border-gray-600">
                <DrawerHeader className="bg-neutral-800">
                  <DrawerTitle className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-tech-blue" />
                    AI Model Recommendations
                  </DrawerTitle>
                  <DrawerDescription className="text-gray-300">
                    Based on your inputs, here are the best AI models for your startup
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-6 overflow-y-auto bg-neutral-800">
                  {recommendations.length > 0 ? <div className="space-y-4">
                      {recommendations.map((rec, index) => <Card key={rec.model.name} className={`relative overflow-hidden transition-smooth hover:shadow-lg bg-[#111111] border-gray-700 ${index === 0 ? 'ring-2 ring-tech-green' : ''}`}>
                          <CardContent className="p-4 bg-neutral-900">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-${rec.model.color}/10`}>
                                  {rec.model.icon}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg text-white">{rec.model.name}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={index === 0 ? "default" : "secondary"}>
                                      {index === 0 ? "🏆 Best Match" : `${rec.score}% match`}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-tech-green">
                                  ${rec.monthlyCost.toFixed(0)}
                                </div>
                                <div className="text-sm text-gray-300">per month</div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {rec.model.strengths.map(strength => <Badge key={strength} variant="outline" className="text-xs">
                                  {strength}
                                </Badge>)}
                            </div>
                            
                            <div className="text-sm text-gray-300">
                              ~{(inputs.monthlyUsers * inputs.sessionsPerDay * inputs.tokensPerSession * 30 / 1000000).toFixed(1)}M tokens/month
                              • ${(rec.model.costPer1kTokens * 1000).toFixed(2)} per 1M tokens
                            </div>
                          </CardContent>
                        </Card>)}
                      
                      <div className="mt-6 p-4 bg-[#111111] border border-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2 text-white">💡 Pro Tips</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Start with the recommended model and test with real usage</li>
                          <li>• Consider using different models for different features</li>
                          <li>• Monitor actual token usage - estimates can vary ±30%</li>
                          <li>• Most providers offer volume discounts for high usage</li>
                        </ul>
                      </div>
                    </div> : <div className="text-center py-16 text-gray-300">
                      <p className="text-xl font-bold">Once you enter your app details, recommended AI Agents will show here</p>
                    </div>}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-tech-green py-4 lg:py-6 mb-40 lg:mb-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <h2 className="text-xl md:text-2xl font-bold text-black text-center lg:text-left">Need help to build your app?</h2>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-3 justify-center lg:justify-end flex-shrink-0">
              <Button asChild size="sm" className="bg-black hover:bg-black/90 text-tech-green font-semibold px-5 w-full sm:w-auto">
                <a href="https://techpacity.agency/contact-us/" target="_blank" rel="noopener noreferrer">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Now
                </a>
              </Button>
              <Button asChild size="sm" className="bg-black hover:bg-black/90 text-tech-green font-semibold px-5 w-full sm:w-auto">
                <a href="https://wa.link/y9by8s" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TooltipProvider>;
}