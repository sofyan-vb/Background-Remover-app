import React, { useState, useRef } from 'react';
import axios from 'axios';

const BackgroundRemover = () => {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
 
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isTransparent, setIsTransparent] = useState(true);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setProcessedImage(null);
      setIsTransparent(true); 
    }
  };

  const handleReset = () => {
    setImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGantiGambar = () => {
    fileInputRef.current.click(); 
  };

  const handleColorChange = (e) => {
    setBackgroundColor(e.target.value);
    setIsTransparent(false); 
  };
 
  const removeBackground = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image_file', image);
    formData.append('size', 'auto');

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          'X-Api-Key': 'Bbx6yckxVGsreuRQiR3XHgWt', 
        },
      });

      const base64Image = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );
      setProcessedImage(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.error('Error removing background:', error);
      alert('Gagal menghapus background. Kemungkinan jatah API Anda sudah habis atau ada masalah jaringan. Silakan periksa Console (F12) untuk detailnya.');
    } finally {
      setLoading(false);
    }
  };

  const resultBgStyle = {
    backgroundColor: isTransparent ? 'transparent' : backgroundColor,
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = processedImage;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!isTransparent) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'hasil-dengan-latar.png';
      link.click();
    };
  };

  return (
    <div className="min-h-screen w-full relative">
      <video 
        autoPlay 
        loop 
        muted 
        className="video-background"
      >
        <source src="https://cdn.pixabay.com/video/2023/10/09/184302-873170023_tiny.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-white font-sans">
        
        <h1 className="text-5xl font-extrabold mb-10 text-center tracking-wide bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animasi-gradasi">
             YANZ REMOVE.BG
        </h1>
        
        <input 
          type="file" 
          id="file-upload" 
          onChange={handleFileChange} 
          className="hidden" 
          ref={fileInputRef}
          accept="image/png, image/jpeg"
        />


        {!image && (
          <div className="bg-gray-800 bg-opacity-70 p-8 rounded-xl shadow-2xl w-full max-w-md flex flex-col items-center space-y-6 backdrop-blur-sm">
             <h2 className="text-2xl font-bold text-white-600">Mulai dengan memilih gambar</h2>
             <button 
                onClick={handleGantiGambar}
                className="w-full px-8 py-4 font-bold rounded-full text-white cursor-pointer shadow-lg transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 animasi-gradasi"
              >
                Pilih Gambar
              </button>
          </div>
        )}
        
        {image && (
          <div className="w-full flex flex-col items-center">
            
           
            {!processedImage && (
              <div className="bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-2xl w-full max-w-xl flex items-center justify-center space-x-4 mb-12 backdrop-blur-sm">
                <button 
                  onClick={handleGantiGambar}
                  className="inline-block px-6 py-3 font-bold rounded-full text- cursor-pointer shadow-lg transform hover:scale-105 transition-transform duration-300 bg-gray-600 hover:bg-gray-500 blinking-glow-effect"
                >                 
                  Pilih Kembali
                </button>
                <button 
                  onClick={removeBackground} 
                  disabled={loading}
                  className="w-auto px-8 py-3 font-bold rounded-full text-white-400 shadow-lg transform hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 animasi-gradasi"
                >
                  {loading ? 'Processing...' : 'Hapus Latar Belakang'}
                </button>
              </div>
            )}
            
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center w-full max-w-5xl">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">Gambar Asli</h2>
                <div className="relative w-full overflow-hidden rounded-lg shadow-xl border-2 border-gray-600 bg-black bg-opacity-20 backdrop-blur-sm">
                  <img src={URL.createObjectURL(image)} alt="Original" className="w-full max-h-96 object-contain" />
                </div>
              </div>
              
              {processedImage && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4 text-purple-400">Hasil</h2>
                  <div className="p-1.5 rounded-2xl bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 animasi-bingkai-berjalan">
                    <div 
                      style={resultBgStyle} 
                      className={`p-1 rounded-xl transition-all duration-300 ${isTransparent ? 'checkerboard-background' : ''}`}
                    >
                      <img src={processedImage} alt="Processed" className="w-full max-h-96 object-contain rounded-lg" />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-800 bg-opacity-70 rounded-lg flex items-center justify-center space-x-4 backdrop-blur-sm">
                    <p className="font-bold">Latar Belakang:</p>
                    <button
                      onClick={() => setIsTransparent(true)}
                      className={`px-5 py-2 rounded-md font-medium transition-all duration-300 ${isTransparent ? 'bg-green-400 text-white active-glow-gray' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      
                      Transparan
                    </button>
                    <div className="relative">
                      <input type="color" value={backgroundColor} onChange={handleColorChange} className="absolute opacity-0 w-full h-full cursor-pointer"/>
                      <button
                        onClick={() => setIsTransparent(false)}
                        className={`px-5 py-2 rounded-md font-medium transition-all duration-300 ${!isTransparent ? 'bg-purple-500 text-white active-glow-purple' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                      >
                        Warna
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center items-center space-x-4">
                    <button
                      onClick={handleGantiGambar}
                      className="inline-flex items-center gap-2 px-8 py-3 font-bold rounded-full text-white cursor-pointer shadow-lg transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-red-500 to-purple-600 blinking-glow-effect"
                    >
                      <span>🔄</span>                     
                        Ubah Gambar
                    </button>
                    <button

                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-8 py-3 font-bold rounded-full text-blue cursor-pointer shadow-lg transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-green-400 via-cyan-400 to-purple-500 animasi-bingkai-berjalan"
                    >
                      <span>⬇️</span>
                      Download Gambar
                    </button>
                    <button 

                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-8 py-3 font-bold rounded-full text-white cursor-pointer shadow-lg transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-red-500 to-purple-600 blinking-glow-effect">
                      <span>🗑️</span>
                      Mengatur Ulang
                    </button>  
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundRemover;