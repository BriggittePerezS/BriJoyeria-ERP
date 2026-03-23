import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  // ESTADO PARA EDICIÓN (NUEVO)
  const [editandoJoya, setEditandoJoya] = useState(null);

  const [nuevaJoya, setNuevaJoya] = useState({
    nombre: '', categoria: '', precio: '', stock: 1, imagenUrl: ''
  });

  const API_URL = "https://brijoyeria-erp.onrender.com/api";

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
      await axios.post(`${API_URL}/productos`, nuevaJoya);
      setNuevaJoya({ nombre: '', categoria: '', precio: '', stock: 1, imagenUrl: '' });
      await cargarDatos();
    } catch (error) {
      alert("❌ Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  // FUNCIÓN PARA GUARDAR EDICIÓN (NUEVO)
const guardarEdicion = async () => {
  try {
    const joyaValidada = {
      Id: editandoJoya.id, // C# suele preferir la primera letra en Mayúscula
      Nombre: editandoJoya.nombre,
      Categoria: editandoJoya.categoria || "General",
      Precio: parseFloat(editandoJoya.precio),
      Stock: parseInt(editandoJoya.stock || 1),
      ImagenUrl: editandoJoya.imagenUrl || "",
      Descripcion: editandoJoya.descripcion || ""
    };

    await axios.put(`${API_URL}/productos/${editandoJoya.id}`, joyaValidada);
    
    setEditandoJoya(null);
    await cargarDatos();
    alert("✅ ¡Bóveda actualizada con éxito!");
  } catch (error) {
    console.error("Error detallado:", error.response?.data);
    alert("Error al guardar. Revisa la consola (F12).");
  }
};
  
  const eliminarJoya = async (id) => {
    if (window.confirm("¿Segura que quieres eliminar esta pieza de la bóveda?")) {
      try {
        await axios.delete(`${API_URL}/productos/${id}`);
        await cargarDatos();
      } catch (error) {
        alert("Error al eliminar.");
      }
    }
  };

  const filtrarPor = (categoria) => {
    setFiltroActivo(categoria);
    if (categoria === 'Todos') {
      setProductosFiltrados(productos);
    } else {
      setProductosFiltrados(productos.filter(p => p.categoria === categoria));
    }
  };

  useEffect(() => { cargarDatos(); }, []);
  useEffect(() => { filtrarPor(filtroActivo); }, [productos]);

  return (
    <div className="min-h-screen bg-[#050b14] p-6 md:p-12 font-sans text-white selection:bg-[#00f2ea] selection:text-[#050b14]">
      
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 border-b border-gray-800/50 pb-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#00f2ea] text-[#050b14] font-black p-2 rounded-lg text-2xl shadow-[0_0_20px_rgba(0,242,234,0.4)]">BJ</div>
            <h1 className="text-4xl font-black tracking-tighter italic">
              BRI <span className="text-[#00f2ea] not-italic">JOYERIA</span>
            </h1>
          </div>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mt-3 font-bold">Encrypted Vault Management // v2.0</p>
        </div>

        <div className="flex gap-4 mt-8 md:mt-0">
          <div className="bg-[#0a111e] px-8 py-5 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00f2ea] opacity-50"></div>
            <p className="text-[10px] text-[#00f2ea] font-bold uppercase tracking-widest mb-1">Capital Total</p>
            <p className="text-3xl font-mono text-white">${reporte?.valorInventarioTotal?.toLocaleString()}</p>
          </div>
          <div className="bg-[#0a111e] px-8 py-5 rounded-2xl border border-gray-800 text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Stock</p>
            <p className="text-3xl font-mono text-[#00f2ea]">{reporte?.piezasTotales}</p>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto mb-16">
        <div className="bg-[#0a111e] p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f2ea]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h2 className="text-sm font-bold mb-8 uppercase tracking-[0.2em] text-[#00f2ea] flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#00f2ea]"></span> Nueva Entrada de Inventario
          </h2>
          
          <form onSubmit={registrarJoya} className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Nombre</label>
              <input type="text" placeholder="Ej. Anillo Diamante" className="p-4 bg-[#050b14] text-white rounded-xl border border-gray-800 outline-none focus:border-[#00f2ea] transition-all" value={nuevaJoya.nombre} onChange={(e) => setNuevaJoya({...nuevaJoya, nombre: e.target.value})} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Categoría</label>
              <select className="p-4 bg-[#050b14] text-white rounded-xl border border-gray-800 outline-none focus:border-[#00f2ea] transition-all cursor-pointer" value={nuevaJoya.categoria} onChange={(e) => setNuevaJoya({...nuevaJoya, categoria: e.target.value})} required>
                <option value="">Seleccionar...</option>
                <option value="Anillo">ANILLO</option><option value="Collar">COLLAR</option><option value="Zarcillo">ZARCILLO</option><option value="Reloj">RELOJ</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Precio ($)</label>
              <input type="number" placeholder="0.00" className="p-4 bg-[#050b14] text-white rounded-xl border border-gray-800 outline-none focus:border-[#00f2ea] transition-all" value={nuevaJoya.precio} onChange={(e) => setNuevaJoya({...nuevaJoya, precio: e.target.value})} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Imagen URL</label>
              <input type="text" placeholder="http://imagen.jpg" className="p-4 bg-[#050b14] text-white rounded-xl border border-gray-800 outline-none focus:border-[#00f2ea] transition-all" value={nuevaJoya.imagenUrl} onChange={(e) => setNuevaJoya({...nuevaJoya, imagenUrl: e.target.value})} />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={cargando} className="w-full bg-[#00f2ea] text-[#050b14] font-black rounded-xl hover:shadow-[0_0_30px_rgba(0,242,234,0.4)] transition-all h-[58px] uppercase tracking-tighter">{cargando ? '...' : 'Registrar'}</button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto mb-10 flex flex-wrap gap-4">
        {['Todos', 'Anillo', 'Collar', 'Zarcillo', 'Reloj'].map((cat) => (
          <button key={cat} onClick={() => filtrarPor(cat)} className={`px-8 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] transition-all border-2 ${filtroActivo === cat ? 'border-[#00f2ea] text-[#00f2ea] bg-[#00f2ea]/5' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {productosFiltrados.map((p) => (
          <div key={p.id} className="bg-[#0a111e] rounded-3xl border border-gray-800 hover:border-[#00f2ea]/50 transition-all group relative overflow-hidden">
            <div className="h-48 w-full overflow-hidden bg-gray-900 relative">
              <img src={p.imagenUrl || 'https://via.placeholder.com/400?text=No+Image'} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="text-[9px] font-black text-[#00f2ea] bg-[#050b14]/80 px-3 py-1 rounded tracking-widest border border-[#00f2ea]/20 backdrop-blur-md">{p.categoria.toUpperCase()}</span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => setEditandoJoya(p)} className="bg-[#00f2ea]/10 hover:bg-[#00f2ea] text-[#00f2ea] hover:text-[#050b14] p-2 rounded-lg transition-all">
                  ✏️
                </button>
                <button onClick={() => eliminarJoya(p.id)} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-6 group-hover:text-[#00f2ea] transition-colors">{p.nombre}</h3>
              <div className="flex justify-between items-end border-t border-gray-800/50 pt-6">
                <div>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Asset Value</p>
                  <p className="text-3xl font-mono text-white">${parseFloat(p.precio).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Stock</p>
                  <p className="text-xl font-bold text-[#00f2ea]">{p.stock} <span className="text-[10px] text-gray-600">PCS</span></p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* MODAL DE EDICIÓN */}
      {editandoJoya && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a111e] p-8 rounded-3xl border border-[#00f2ea] w-full max-w-sm">
            <h3 className="text-xl font-bold mb-6 text-white">Editar {editandoJoya.nombre}</h3>
            <input className="w-full p-4 mb-4 bg-[#050b14] border border-gray-800 rounded-xl text-white" value={editandoJoya.nombre} onChange={e => setEditandoJoya({...editandoJoya, nombre: e.target.value})} />
            <input className="w-full p-4 mb-4 bg-[#050b14] border border-gray-800 rounded-xl text-white" value={editandoJoya.imagenUrl || ''} onChange={e => setEditandoJoya({...editandoJoya, imagenUrl: e.target.value})} />
            <input className="w-full p-4 mb-4 bg-[#050b14] border border-gray-800 rounded-xl text-white" value={editandoJoya.precio} onChange={e => setEditandoJoya({...editandoJoya, precio: e.target.value})} />
            <div className="flex gap-4 mt-6">
              <button onClick={guardarEdicion} className="flex-1 bg-[#00f2ea] text-[#050b14] font-bold py-3 rounded-xl">GUARDAR</button>
              <button onClick={() => setEditandoJoya(null)} className="flex-1 bg-gray-800 text-white py-3 rounded-xl">CERRAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;