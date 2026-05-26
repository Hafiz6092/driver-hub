import { useEffect, useState } from 'react';
import { FaCloudSun, FaLocationArrow, FaTemperatureHigh } from 'react-icons/fa';
import { fetchWeather } from '../utils/weather';

const WeatherCard = () => {
  // If geolocation does not exist, we know up front that weather cannot load.
  const supportsGeolocation =
    typeof navigator !== 'undefined' && Boolean(navigator.geolocation);

  // weather holds the live data returned from the weather utility.
  const [weather, setWeather] = useState(null);

  // status controls which UI state we render: loading, success, or error.
  const [status, setStatus] = useState(() => (supportsGeolocation ? 'loading' : 'error'));

  // message is only used for loading/error copy.
  const [message, setMessage] = useState(() => {
    if (!supportsGeolocation) {
      return 'Geolocation is not supported in this browser.';
    }

    return 'Checking local driving weather...';
  });

  useEffect(() => {
    if (!supportsGeolocation) {
      return;
    }

    // When location succeeds, pass the coordinates into the weather helper.
    const handleSuccess = async ({ coords }) => {
      const weatherData = await fetchWeather(coords.latitude, coords.longitude);

      if (!weatherData) {
        setStatus('error');
        setMessage('Weather data is unavailable right now.');
        return;
      }

      setWeather(weatherData);
      setStatus('success');
    };

    // If the browser blocks location, fall back to a helpful message.
    const handleError = () => {
      setStatus('error');
      setMessage('Allow location access to see weather for your area.');
    };

    // maximumAge lets the browser reuse a recent location for a short window.
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 1000 * 60 * 15,
    });
  }, [supportsGeolocation]);

  return (
    <section className="h-full overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-700 via-blue-600 to-sky-400 p-6 text-white shadow-xl hover:shadow-blue-500 shadow-blue-500/70 text-left">
      <div className="flex h-full flex-col gap-5 ">
        {/* Card intro */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-100">
            Driving Weather
          </p>
          <h2 className="mt-2 text-3xl font-bold">Plan your shift with live conditions</h2>
          <p className="mt-2 max-w-2xl text-sm text-sky-50/95">
            Quick weather context for the road before you head out.
          </p>
        </div>

        <div className="min-w-full rounded-2xl bg-white/15 p-4 backdrop-blur-sm md:min-w-[320px]">
          {status === 'success' && weather ? (
            <div className="space-y-3">
              {/* Top line: location label + current temperature */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-sky-100">
                    {weather.locationLabel}
                  </p>
                  <p className="mt-1 text-4xl font-bold">{weather.temp}°F</p>
                </div>

                <div className="rounded-full bg-white/15 p-4">
                  <FaCloudSun className="text-3xl text-white" />
                </div>
              </div>

              {/* Detail boxes: conditions, description, feels like, and wind */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-black/10 p-3">
                  <p className="flex items-center gap-2 text-sky-100">
                    <FaCloudSun />
                    Conditions
                  </p>
                  <p className="mt-1 font-semibold text-white">{weather.condition}</p>
                </div>

                <div className="rounded-xl bg-black/10 p-3">
                  <p className="flex items-center gap-2 text-sky-100">
                    <FaTemperatureHigh />
                    Details
                  </p>
                  <p className="mt-1 font-semibold capitalize text-white">{weather.description}</p>
                </div>

                <div className="rounded-xl bg-black/10 p-3">
                  <p className="text-sky-100">Feels Like</p>
                  <p className="mt-1 font-semibold text-white">{weather.feelsLike}°F</p>
                </div>

                <div className="rounded-xl bg-black/10 p-3">
                  <p className="text-sky-100">Wind</p>
                  <p className="mt-1 font-semibold text-white">{weather.windSpeed} mph</p>
                </div>
              </div>
            </div>
          ) : (
            // Same box structure, but used for loading and error states.
            <div className="flex items-start gap-3 rounded-xl bg-black/10 p-4 text-sm">
              <FaLocationArrow className="mt-0.5 shrink-0 text-base text-sky-100" />
              <p className="font-medium text-white">{message}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WeatherCard;
