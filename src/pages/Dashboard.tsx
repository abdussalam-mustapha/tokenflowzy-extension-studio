
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const [activeToken, setActiveToken] = useState('SampleToken');
  
  // Mock data for the dashboard
  const tokens = [
    {
      id: 'SampleToken',
      name: 'Sample Token',
      symbol: 'SMPL',
      supply: '1,000,000',
      price: '$0.05',
      holders: 42,
      transfers: 156,
      royalties: '2.35 SOL',
      features: ['Transfer Fee (1%)'],
      recentActivity: [
        { type: 'Transfer', from: 'User1', to: 'User2', amount: '1,000 SMPL', time: '2 hours ago' },
        { type: 'Fee Collected', from: 'Transfer', to: 'You', amount: '10 SMPL', time: '2 hours ago' },
        { type: 'Transfer', from: 'User3', to: 'User4', amount: '5,000 SMPL', time: '4 hours ago' },
        { type: 'Fee Collected', from: 'Transfer', to: 'You', amount: '50 SMPL', time: '4 hours ago' },
      ]
    },
    {
      id: 'RewardToken',
      name: 'Reward Token',
      symbol: 'RWD',
      supply: '500,000',
      price: '$0.10',
      holders: 18,
      transfers: 73,
      royalties: '1.2 SOL',
      features: ['Staking Rewards (5% APY)'],
      recentActivity: [
        { type: 'Stake', from: 'User5', to: 'Staking Pool', amount: '2,000 RWD', time: '1 day ago' },
        { type: 'Reward', from: 'Staking', to: 'User5', amount: '2.74 RWD', time: '12 hours ago' },
        { type: 'Transfer', from: 'You', to: 'User6', amount: '500 RWD', time: '2 days ago' },
      ]
    }
  ];

  // Find the current active token data
  const currentToken = tokens.find(t => t.id === activeToken) || tokens[0];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Token Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your tokens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with token list */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Tokens</CardTitle>
              <CardDescription>Select a token to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tokens.map(token => (
                  <button
                    key={token.id}
                    className={`w-full p-3 text-left rounded-md transition-colors ${
                      activeToken === token.id 
                        ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500' 
                        : 'hover:bg-gray-100 border-l-4 border-transparent'
                    }`}
                    onClick={() => setActiveToken(token.id)}
                  >
                    <div className="font-medium">{token.name}</div>
                    <div className="text-sm text-gray-500">{token.symbol}</div>
                  </button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
              >
                Create New Token
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="holders">Holders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Token Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentToken.name}</div>
                    <p className="text-sm text-gray-500">{currentToken.symbol}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Supply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentToken.supply}</div>
                    <p className="text-sm text-gray-500">Current price: {currentToken.price}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Royalties Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentToken.royalties}</div>
                    <p className="text-sm text-gray-500">From {currentToken.transfers} transfers</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Activity Overview</CardTitle>
                    <CardDescription>Token transfers over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md border">
                      <span className="text-gray-400">Activity chart will appear here</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Token Features</CardTitle>
                    <CardDescription>Active extensions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentToken.features.map((feature, index) => (
                        <li 
                          key={index}
                          className="flex items-center bg-gray-50 p-2 rounded-md"
                        >
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-4">
                      Add Feature
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Token Distribution</CardTitle>
                  <CardDescription>How your token is distributed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Creator Holdings</span>
                        <span>70%</span>
                      </div>
                      <Progress value={70} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Public Distribution</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Reserved for Rewards</span>
                        <span>5%</span>
                      </div>
                      <Progress value={5} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest transactions and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentToken.recentActivity.map((activity, i) => (
                      <div 
                        key={i} 
                        className="flex items-start justify-between p-3 border-b last:border-0"
                      >
                        <div>
                          <div className="font-medium">{activity.type}</div>
                          <div className="text-sm text-gray-500">
                            {activity.from} → {activity.to}
                          </div>
                        </div>
                        <div className="text-right">
                          <div>{activity.amount}</div>
                          <div className="text-sm text-gray-500">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="holders">
              <Card>
                <CardHeader>
                  <CardTitle>Token Holders</CardTitle>
                  <CardDescription>Users holding your token</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Balance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="font-medium">You</span>
                            <span className="ml-2 text-gray-500">Gn5...8xPq</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            700,000 {currentToken.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            70%
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-gray-500">Af3...7Rtz</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            150,000 {currentToken.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            15%
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-gray-500">Hp8...2Lmx</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            100,000 {currentToken.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            10%
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-gray-500">Others ({currentToken.holders - 3} holders)</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            50,000 {currentToken.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            5%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Download Holder Report
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Token Settings</CardTitle>
                  <CardDescription>Configure your token parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Token Features</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Adjust the parameters of your token's features
                      </p>
                      
                      {currentToken.features.map((feature, index) => {
                        if (feature.includes('Transfer Fee')) {
                          return (
                            <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                              <h4 className="font-medium">Transfer Fee</h4>
                              <div className="flex items-center mt-2">
                                <span className="mr-2">Current fee:</span>
                                <span className="font-medium">1%</span>
                                <Button variant="outline" size="sm" className="ml-auto">
                                  Adjust
                                </Button>
                              </div>
                            </div>
                          );
                        }
                        if (feature.includes('Staking Rewards')) {
                          return (
                            <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                              <h4 className="font-medium">Staking Rewards</h4>
                              <div className="flex items-center mt-2">
                                <span className="mr-2">Current APY:</span>
                                <span className="font-medium">5%</span>
                                <Button variant="outline" size="sm" className="ml-auto">
                                  Adjust
                                </Button>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Advanced Settings</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          Update Metadata
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Transfer Authority
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                          Freeze Token
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
