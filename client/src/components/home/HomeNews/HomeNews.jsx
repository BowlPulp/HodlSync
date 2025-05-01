import { useState, useEffect, useCallback, useMemo } from 'react';
import { ExternalLink, Loader, RefreshCw } from 'lucide-react';
import HomeNavbar from '../HomeNavbar/HomeNavbar';
import Footer from '../../footer/Footer';

// Utility to strip HTML and clean description
const stripHtml = (html) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Extract source from description or title
const extractSource = (description, title) => {
  const match = description.match(/<\/a>\s*(.+)$/i) || title.match(/-\s*(.+)$/);
  return match ? match[1].trim() : 'Unknown';
};

export default function HomeNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Constants
  const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;
  const DEBOUNCE_TIME = 1000;

  // Check cache
  const getCachedNews = useCallback(() => {
    const cached = localStorage.getItem('cryptoNews');
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return Array.isArray(data) ? data : [];
      }
    }
    return null;
  }, []);

  // Save to cache
  const setCachedNews = useCallback((data) => {
    if (Array.isArray(data)) {
      localStorage.setItem('cryptoNews', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    }
  }, []);

  // Fetch news with retry logic
  const fetchNews = useCallback(async (controller, retryCount = 0) => {
    const cachedNews = getCachedNews();
    if (cachedNews) {
      setNews(cachedNews);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Replace YOUR_API_KEY with your actual rss2json.com API key
      const response = await fetch(
        'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=cryptocurrency',
        { signal: controller.signal }
      );

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error('Invalid API key or request parameters. Please check your rss2json.com API key.');
        }
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status !== 'ok' || !Array.isArray(data.items)) {
        throw new Error('Invalid API response: items is not an array or status is not ok');
      }

      setNews(data.items);
      setCachedNews(data.items);
      setError(null);
      setLastFetchTime(Date.now());
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }

      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        return fetchNews(controller, retryCount + 1);
      }

      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to load crypto news. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [getCachedNews, setCachedNews]);

  // Debounce refresh
  const debounce = useCallback((fn) => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(fn, DEBOUNCE_TIME);
    };
  }, []);

  // Handle refresh
  const handleRefresh = useMemo(() => debounce(() => {
    const controller = new AbortController();
    fetchNews(controller);
    setPage(1);
    return () => controller.abort();
  }), [fetchNews, debounce]);

  // Load news on mount
  useEffect(() => {
    const controller = new AbortController();
    fetchNews(controller);
    return () => controller.abort();
  }, [fetchNews]);

  // Format date to relative time
  const formatRelativeTime = useCallback((dateString) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - publishedDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }, []);

  // Calculate items to display
  const itemsPerPage = 5;
  const maxPage = news.length ? Math.ceil(news.length / itemsPerPage) : 1;
  const displayedNews = useMemo(() => 
    Array.isArray(news) ? news.slice((page - 1) * itemsPerPage, page * itemsPerPage) : [],
    [news, page]
  );

  return (
    <>
      <HomeNavbar />
      <div className="w-full p-6 bg-gradient-to-br from-green-900 via-gray-800 to-black shadow-2xl">
        <div className="flex justify-between items-center mb-8 mt-20">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Crypto News</h1>
          <button
            onClick={handleRefresh}
            disabled={loading || (lastFetchTime && Date.now() - lastFetchTime < DEBOUNCE_TIME)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-medium">Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size={40} className="text-indigo-400 animate-spin" />
            <span className="ml-3 text-lg text-indigo-200 font-medium">Loading latest crypto news...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-5 text-red-200 text-center">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {displayedNews.length > 0 ? displayedNews.map((item, index) => (
              <article 
                key={index} 
                className="bg-gray-800 bg-opacity-70 p-6 rounded-xl hover:bg-gray-700 transition-all duration-300 border border-gray-600 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-start gap-5">
                  
               
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-white mb-2 leading-tight hover:text-indigo-300 transition-colors duration-200">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                    </h2>
                    <p className="text-gray-200 text-base mb-4 line-clamp-3">{stripHtml(item.description)}</p>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-indigo-400 font-medium">{item.author || extractSource(item.description, item.title)}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{item.pubDate ? formatRelativeTime(item.pubDate) : 'Unknown date'}</span>
                      </div>

                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
                      >
                        Read more <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                {item.categories?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.categories.slice(0, 3).map((category, i) => (
                      <span key={i} className="bg-indigo-900 bg-opacity-50 text-indigo-200 px-3 py-1 rounded-full text-xs font-medium">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            )) : (
              <div className="text-gray-300 text-center text-lg font-medium">No news available at the moment.</div>
            )}

            {news.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Previous
                </button>

                <span className="text-gray-200 font-medium">
                  Page {page} of {maxPage}
                </span>

                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, maxPage))}
                  disabled={page === maxPage}
                  className="px-5 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}