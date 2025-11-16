import { useEffect } from 'react';

function App() {
  useEffect(() => {
		const preloader = document.getElementById("preloader");
		if (preloader) {
			preloader.style.opacity = "0";
			setTimeout(() => {
				if (preloader.parentNode) {
					preloader.parentNode.removeChild(preloader);
				}
			}, 1000);
		}
		setTimeout(() => {
			if (typeof window.clear === "function") {
				window.clear();
			}
		}, 1000);
	}, []);

  return (
    <div className='flex justify-center items-center bg-gray-100'>
      <h1>
        Intelink Web App
      </h1>
    </div>
  )
}

export default App
