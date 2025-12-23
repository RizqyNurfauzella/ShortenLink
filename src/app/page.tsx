import LinkForm from '@/components/link-form';
import History from '@/components/history';
import { Zap, Shield, BarChart3, QrCode } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-16 animate-fade-in pt-8">
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-8 animate-slide-up">
              ShortenLink
            </h1>
            <h2 className="text-2xl md:text-4xl font-light text-slate-600 dark:text-slate-300 mb-6 animate-slide-up animation-delay-200">
              Shorten Your Links Instantly
            </h2>
          </div>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-400">
            Create short, secure links with QR codes and detailed analytics. Fast, reliable, and easy to use.
          </p>
          <div className="animate-slide-up animation-delay-600">
            <LinkForm />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 mb-16 animate-fade-in animation-delay-800">
          <div className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20 dark:border-slate-700/20">
            <div className="bg-blue-500/10 dark:bg-blue-400/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors duration-300">
              <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Lightning Fast</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Instant link shortening with minimal latency</p>
          </div>
          <div className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20 dark:border-slate-700/20">
            <div className="bg-green-500/10 dark:bg-green-400/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors duration-300">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Secure & Reliable</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Enterprise-grade security with 99.9% uptime</p>
          </div>
          <div className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20 dark:border-slate-700/20">
            <div className="bg-purple-500/10 dark:bg-purple-400/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors duration-300">
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Detailed Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Track clicks, locations, and user behavior</p>
          </div>
          <div className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20 dark:border-slate-700/20">
            <div className="bg-orange-500/10 dark:bg-orange-400/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/20 transition-colors duration-300">
              <QrCode className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">QR Code Generation</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Generate and download QR codes instantly</p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <History />
        </div>
      </main>
    </div>
  );
}
