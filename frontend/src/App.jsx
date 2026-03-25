import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [editandoJoya, setEditandoJoya] = useState(null);

  const [nuevaJoya, setNuevaJoya] = useState({
    nombre: '', categoria: '', precio: '', stock: 1, imagenUrl: ''
  });

  // ⚠️ CAMBIA ESTO: Usa la URL de tu BACKEND (Web Service), 
  const API_URL = "https://brijoyeria-erp.onrender.com/api/productos"; 

  const cargarDatos = async () => {
    try {
      const resProds = await axios.get(`${API_URL}/productos`);
      const resRep = await axios.get(`${API_URL}/reporte-valor`);
      setProductos(resProds.data);
      setProductosFiltrados(resProds.data);
      setReporte(resRep.data);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  const registrarJoya = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const joyaFinal = {
        Nombre: nuevaJoya.nombre,
        Categoria: nuevaJoya.categoria || "General",
        Precio: parseFloat(nuevaJoya.precio) || 0,
        Stock: parseInt(nuevaJoya.stock) || 1,
        ImagenUrl: nuevaJoya.imagenUrl || ""
      };
      await axios.post(`${API_URL}/productos`, joyaFinal);
      setNuevaJoya({ nombre: '', categoria: '', precio: '', stock: 1, imagenUrl: '' });
      await cargarDatos();
      alert("💎 Joya guardada!");
    } catch (error) {
      alert("❌ Error de conexión. Revisa la URL del backend.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarJoya = async (id) => {
    if (window.confirm("¿Eliminar de la bóveda?")) {
      try {
        await axios.delete(`${API_URL}/productos/${id}`);
        await cargarDatos();
      } catch (error) {
        alert("Error al eliminar.");
      }
    }
  };

  const filtrarPor = (cat) => {
    setFiltroActivo(cat);
    if (cat === 'Todos') setProductosFiltrados(productos);
    else setProductosFiltrados(productos.filter(p => p.categoria === cat));
  };

  useEffect(() => { cargarDatos(); }, []);

  return (
    <div className="min-h-screen bg-[#050b14] p-6 text-white font-sans">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10 border-b border-gray-800 pb-8">
        <h1 className="text-3xl font-black italic">BRI <span className="text-[#00f2ea] not-italic">JOYERIA</span></h1>
        <div className="flex gap-4">
          <div className="bg-[#0a111e] p-4 rounded-xl border border-gray-800">
            <p className="text-[10px] text-[#00f2ea] uppercase font-bold">Capital Total</p>
            <p className="text-2xl font-mono">${reporte?.valorInventarioTotal?.toLocaleString() || '0'}</p>
          </div>
          <div className="bg-[#0a111e] p-4 rounded-xl border border-gray-800">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Stock</p>
            <p className="text-2xl font-mono text-[#00f2ea]">{reporte?.piezasTotales || '0'}</p>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto mb-12 bg-[#0a111e] p-8 rounded-3xl border border-gray-800">
        <form onSubmit={registrarJoya} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input className="p-4 bg-[#050b14] border border-gray-800 rounded-xl" placeholder="Nombre" value={nuevaJoya.nombre} onChange={e => setNuevaJoya({...nuevaJoya, nombre: e.target.value})} required />
          <select className="p-4 bg-[#050b14] border border-gray-800 rounded-xl" value={nuevaJoya.categoria} onChange={e => setNuevaJoya({...nuevaJoya, categoria: e.target.value})} required>
            <option value="">Categoría...</option>
            <option value="Anillo">ANILLO</option>
            <option value="Collar">COLLAR</option>
            <option value="Zarcillo">ZARCILLO</option>
            <option value="Reloj">RELOJ</option>
          </select>
          <input type="number" className="p-4 bg-[#050b14] border border-gray-800 rounded-xl" placeholder="Precio" value={nuevaJoya.precio} onChange={e => setNuevaJoya({...nuevaJoya, precio: e.target.value})} required />
          <input className="p-4 bg-[#050b14] border border-gray-800 rounded-xl" placeholder="URL Imagen" value={nuevaJoya.imagenUrl} onChange={e => setNuevaJoya({...nuevaJoya, imagenUrl: e.target.value})} />
          <button className="bg-[#00f2ea] text-[#050b14] font-bold rounded-xl hover:scale-105 transition-transform">{cargando ? '...' : 'REGISTRAR'}</button>
        </form>
      </section>

      <div className="max-w-7xl mx-auto flex gap-2 mb-8">
        {['Todos', 'Anillo', 'Collar', 'Zarcillo', 'Reloj'].map(cat => (
          <button key={cat} onClick={() => filtrarPor(cat)} className={`px-4 py-2 rounded-lg text-xs font-bold border ${filtroActivo === cat ? 'border-[#00f2ea] text-[#00f2ea]' : 'border-gray-800 text-gray-500'}`}>{cat.toUpperCase()}</button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map(p => (
          <div key={p.id} className="bg-[#0a111e] rounded-2xl border border-gray-800 overflow-hidden group">
            <img src={p.imagenUrl || 'https://via.placeholder.com/400'} className="h-48 w-full object-cover" alt={p.nombre} />
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">{p.nombre}</h3>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-mono text-[#00f2ea]">${p.precio?.toLocaleString()}</p>
                <button onClick={() => eliminarJoya(p.id)} className="text-red-500 hover:text-red-300">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;