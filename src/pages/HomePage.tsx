import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Upload, 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Upload,
      title: 'Easy CSV Import',
      description: 'Simply upload your sales CSV file and get instant insights. No complex setup required.',
    },
    {
      icon: TrendingUp,
      title: 'Financial Trends',
      description: 'Track revenue, costs, and profit margins over time with interactive charts and visualizations.',
    },
    {
      icon: Package,
      title: 'Brand & Product Analytics',
      description: 'Analyze performance by brand and product to identify your best and worst performers.',
    },
    {
      icon: Users,
      title: 'Staff Performance',
      description: 'Monitor salesman performance with detailed leaderboards and metrics.',
    },
    {
      icon: AlertTriangle,
      title: 'Data Quality Detection',
      description: 'Automatically detect and fix brand name inconsistencies like typos, case differences, and duplicates.',
    },
    {
      icon: BarChart3,
      title: 'Key Performance Indicators',
      description: 'View critical KPIs including total revenue, net profit, average transaction value, and return rates.',
    },
  ];

  const benefits = [
    'No account or signup required',
    'Your data stays private - processed locally',
    'Works with standard sales CSV formats',
    'Filter by outlet, brand, salesman, and date',
    'Export-ready insights and reports',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-primary/10">
                <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Counter Sales Analytics
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transform your sales data into actionable insights. Upload your CSV file and instantly 
              visualize trends, track performance, and make data-driven decisions.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze your counter sales performance in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Why Choose Counter Sales Analytics?
              </h2>
              <p className="text-muted-foreground mb-8">
                Built for simplicity and speed, our analytics platform helps you understand 
                your sales data without the complexity of traditional business intelligence tools.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border/50 p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-2xl font-bold text-primary">₱1.2M</div>
                    <div className="text-xs text-muted-foreground">Total Revenue</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-2xl font-bold text-profit">₱340K</div>
                    <div className="text-xs text-muted-foreground">Net Profit</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-2xl font-bold">28.3%</div>
                    <div className="text-xs text-muted-foreground">Profit Margin</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-2xl font-bold">1,847</div>
                    <div className="text-xs text-muted-foreground">Transactions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Analyze Your Sales Data?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your CSV file and start gaining insights in seconds. 
            No signup required, no data stored on servers.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Analyzing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>Counter Sales Analytics — Transform your sales data into actionable insights</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
