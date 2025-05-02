
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';

const CreateToken = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [tokenData, setTokenData] = useState({
    name: '',
    symbol: '',
    supply: '1000000',
    decimals: '9',
    features: {
      transferFee: false,
      stakingRewards: false,
      burnMechanism: false,
    },
    feePercentage: '1',
    rewardRate: '5',
    burnRate: '2',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTokenData({ ...tokenData, [name]: value });
  };

  const handleFeatureToggle = (feature: string) => {
    setTokenData({
      ...tokenData,
      features: {
        ...tokenData.features,
        [feature]: !tokenData.features[feature as keyof typeof tokenData.features],
      },
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setTokenData({ ...tokenData, [name]: value });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!tokenData.name || !tokenData.symbol)) {
      toast({
        title: "Missing Information",
        description: "Please provide both token name and symbol",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    toast({
      title: "Token Preview Generated",
      description: "Your token has been configured and is ready for review.",
    });
    setCurrentStep(currentStep + 1);
  };

  const steps = [
    { name: 'Basic Info', description: 'Name and supply' },
    { name: 'Features', description: 'Add functionality' },
    { name: 'Configuration', description: 'Set parameters' },
    { name: 'Preview', description: 'Review and create' },
  ];

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. My Awesome Token"
                value={tokenData.name}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-500">
                The name of your token, as it will appear to users
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Token Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                placeholder="e.g. MAT"
                value={tokenData.symbol}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-500">
                A short ticker symbol for your token (2-6 characters recommended)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supply">Total Supply</Label>
              <Input
                id="supply"
                name="supply"
                type="number"
                placeholder="1000000"
                value={tokenData.supply}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-500">
                The total number of tokens that will exist
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="decimals">Decimals</Label>
              <Select
                value={tokenData.decimals}
                onValueChange={(value) => handleSelectChange('decimals', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select decimals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="9">9 (recommended)</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                How divisible your token will be (9 is standard for most tokens)
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Choose Token Features</h3>
              <p className="text-sm text-gray-500">
                Select the functionality you want to add to your token
              </p>

              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="transferFee"
                  checked={tokenData.features.transferFee}
                  onCheckedChange={() => handleFeatureToggle('transferFee')}
                />
                <div>
                  <Label 
                    htmlFor="transferFee"
                    className="text-base font-medium cursor-pointer"
                  >
                    Transfer Fee
                  </Label>
                  <p className="text-sm text-gray-500">
                    Earn a percentage on every transfer of your token
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="stakingRewards"
                  checked={tokenData.features.stakingRewards}
                  onCheckedChange={() => handleFeatureToggle('stakingRewards')}
                />
                <div>
                  <Label 
                    htmlFor="stakingRewards"
                    className="text-base font-medium cursor-pointer"
                  >
                    Staking Rewards
                  </Label>
                  <p className="text-sm text-gray-500">
                    Allow users to earn rewards by staking your token
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="burnMechanism"
                  checked={tokenData.features.burnMechanism}
                  onCheckedChange={() => handleFeatureToggle('burnMechanism')}
                />
                <div>
                  <Label 
                    htmlFor="burnMechanism"
                    className="text-base font-medium cursor-pointer"
                  >
                    Burn Mechanism
                  </Label>
                  <p className="text-sm text-gray-500">
                    Automatically burn a percentage of tokens on transfer
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {tokenData.features.transferFee && (
              <div className="space-y-2">
                <Label htmlFor="feePercentage">Transfer Fee (%)</Label>
                <Input
                  id="feePercentage"
                  name="feePercentage"
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  placeholder="1"
                  value={tokenData.feePercentage}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500">
                  Percentage of each transfer that goes to the token creator
                </p>
              </div>
            )}
            {tokenData.features.stakingRewards && (
              <div className="space-y-2">
                <Label htmlFor="rewardRate">Staking Reward Rate (% per year)</Label>
                <Input
                  id="rewardRate"
                  name="rewardRate"
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  placeholder="5"
                  value={tokenData.rewardRate}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500">
                  Annual percentage yield for staking this token
                </p>
              </div>
            )}
            {tokenData.features.burnMechanism && (
              <div className="space-y-2">
                <Label htmlFor="burnRate">Burn Rate (%)</Label>
                <Input
                  id="burnRate"
                  name="burnRate"
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  placeholder="2"
                  value={tokenData.burnRate}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500">
                  Percentage of tokens to burn on each transfer
                </p>
              </div>
            )}
            {!tokenData.features.transferFee && !tokenData.features.stakingRewards && !tokenData.features.burnMechanism && (
              <div className="text-center p-6">
                <p className="text-gray-500">No features selected. Your token will have basic transfer functionality.</p>
                <p className="text-sm text-gray-400 mt-2">You can always add features later.</p>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-500">Token Name</h4>
                  <p>{tokenData.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Symbol</h4>
                  <p>{tokenData.symbol}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Total Supply</h4>
                  <p>{parseInt(tokenData.supply).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Decimals</h4>
                  <p>{tokenData.decimals}</p>
                </div>
              </div>

              <h4 className="font-medium text-gray-500 mt-6 mb-2">Features</h4>
              {!tokenData.features.transferFee && !tokenData.features.stakingRewards && !tokenData.features.burnMechanism ? (
                <p>Basic token with no additional features</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {tokenData.features.transferFee && (
                    <li>Transfer Fee: {tokenData.feePercentage}%</li>
                  )}
                  {tokenData.features.stakingRewards && (
                    <li>Staking Rewards: {tokenData.rewardRate}% APY</li>
                  )}
                  {tokenData.features.burnMechanism && (
                    <li>Burn Rate: {tokenData.burnRate}% per transfer</li>
                  )}
                </ul>
              )}

              <div className="mt-6 p-4 bg-yellow-50 rounded-md border border-yellow-100">
                <h4 className="font-medium text-yellow-800">Estimated Cost</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  0.1 SOL + network fees
                  {tokenData.features.transferFee && " + 0.05 SOL (Transfer Fee)"}
                  {tokenData.features.stakingRewards && " + 0.08 SOL (Staking Rewards)"}
                  {tokenData.features.burnMechanism && " + 0.03 SOL (Burn Mechanism)"}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Create Your Token</h1>
          <p className="text-gray-600 mt-2">
            Follow the steps below to create your custom Solana token
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <ol className="flex items-center w-full">
            {steps.map((step, i) => (
              <li 
                key={i}
                className={`flex items-center ${
                  i < steps.length - 1 ? 'w-full' : ''
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep > i + 1 ? 'bg-purple-600' : 
                  currentStep === i + 1 ? 'bg-purple-600' : 'bg-gray-200'
                } shrink-0`}>
                  {currentStep > i + 1 ? (
                    <svg className="w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={`text-xs font-medium ${
                      currentStep === i + 1 ? 'text-white' : 'text-gray-500'
                    }`}>
                      {i + 1}
                    </span>
                  )}
                </div>
                <div className="ml-2 hidden sm:block">
                  <h3 className={`text-sm font-medium ${
                    currentStep === i + 1 ? 'text-purple-600' : 'text-gray-900'
                  }`}>
                    {step.name}
                  </h3>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > i + 1 ? 'bg-purple-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {getStepContent()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            {currentStep < 4 ? (
              <Button onClick={handleNextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              >
                Preview Token
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateToken;
