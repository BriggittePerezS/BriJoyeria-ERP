import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null); // Para saber si estamos editando

  const [nuevaJoya, setNuevaJoya] = useState({
    nombre: '', categoria: '', precio: '', stock: 1, imagenUrl: ''
  });

  const API_URL = "https://brijoyeria-erp.onrender.com/api/productos";

  const cargarDatos = async () => {
    try {
      const resProds = await axios.get(API_URL);
      const resRep = await axios.get(`${API_URL}/reporte-valor`);
      setProductos(resProds.data);
      setReporte(resRep.data);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  // Función para preparar el formulario para editar
  const prepararEdicion = (joya) => {
    setEditandoId(joya.id);
    setNuevaJoya({
      nombre: joya.nombre,
      categoria: joya.categoria,
      precio: joya.precio,
      stock: joya.stock,
      imagenUrl: joya.imagenUrl
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al formulario
  };

  const guardarJoya = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const joyaFinal = {
        Id: editandoId || 0, // Si es nuevo es 0, si no, el ID real
        Nombre: nuevaJoya.nombre,
        Categoria: nuevaJoya.categoria,
        Precio: parseFloat(nuevaJoya.precio),
        Stock: parseInt(nuevaJoya.stock),
        ImagenUrl: nuevaJoya.imagenUrl
      };

      if (editandoId) {
        // MODO EDITAR (PUT)
        await axios.put(`${API_URL}/${editandoId}`, joyaFinal);
        alert("💎 Joya actualizada!");
      } else {
        // MODO CREAR (POST)
        await axios.post(API_URL, joyaFinal);
        alert("💎 Joya guardada!");
      }

      setNuevaJoya({ nombre: '', categoria: '', precio: '', stock: 1, imagenUrl: '' });
      setEditandoId(null);
      await cargarDatos();
    } catch (error) {
      alert("❌ Error al procesar la joya.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarJoya = async (id) => {
    if (window.confirm("¿Eliminar permanentemente?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        await cargarDatos();
      } catch (error) {
        alert("Error al eliminar.");
      }
    }
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

      {/* FORMULARIO */}
      <section className="max-w-7xl mx-auto mb-12 bg-[#0a111e] p-8 rounded-3xl border border-[#00f2ea]/20 shadow-lg shadow-[#00f2ea]/5">
        <h2 className="mb-4 text-[#00f2ea] font-bold uppercase tracking-widest text-xs">
            {editandoId ? "🔧 Editando Registro" : "✨ Nuevo Registro"}
        </h2>
        <form onSubmit={guardarJoya} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input 
            className="p-4 bg-[#050b14] border border-gray-800 rounded-xl focus:border-[#00f2ea] outline-none" 
            placeholder="Ej: Anillo Diamante 18k" 
            value={nuevaJoya.nombre} 
            onChange={e => setNuevaJoya({...nuevaJoya, nombre: e.target.value})} required 
          />
          <select 
            className="p-4 bg-[#050b14] border border-gray-800 rounded-xl focus:border-[#00f2ea] outline-none" 
            value={nuevaJoya.categoria} 
            onChange={e => setNuevaJoya({...nuevaJoya, categoria: e.target.value})} required
          >
            <option value="">Categoría...</option>
            <option value="Anillo">ANILLO</option>
            <option value="Collar">COLLAR</option>
            <option value="Zarcillo">ZARCILLO</option>
            <option value="Reloj">RELOJ</option>
          </select>
          <input 
            type="number" 
            className="p-4 bg-[#050b14] border border-gray-800 rounded-xl focus:border-[#00f2ea] outline-none" 
            placeholder="Precio (Ej: 1500)" 
            value={nuevaJoya.precio} 
            onChange={e => setNuevaJoya({...nuevaJoya, precio: e.target.value})} required 
          />
          <input 
            className="p-4 bg-[#050b14] border border-gray-800 rounded-xl focus:border-[#00f2ea] outline-none" 
            placeholder="URL de Imagen (Opcional)" 
            value={nuevaJoya.imagenUrl} 
            onChange={e => setNuevaJoya({...nuevaJoya, imagenUrl: e.target.value})} 
          />
          <div className="flex gap-2">
            <button className="flex-1 bg-[#00f2ea] text-[#050b14] font-bold rounded-xl hover:scale-105 transition-all">
                {cargando ? '...' : (editandoId ? 'ACTUALIZAR' : 'REGISTRAR')}
            </button>
            {editandoId && (
                <button 
                    type="button" 
                    onClick={() => {setEditandoId(null); setNuevaJoya({nombre:'', categoria:'', precio:'', stock:1, imagenUrl:''})}}
                    className="px-4 bg-gray-800 rounded-xl hover:bg-gray-700"
                >
                    X
                </button>
            )}
          </div>
        </form>
      </section>

      {/* LISTA DE JOYAS */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map(p => (
          <div key={p.id} className="bg-[#0a111e] rounded-2xl border border-gray-800 overflow-hidden group hover:border-[#00f2ea]/50 transition-all duration-300">
            {/* Contenedor de la imagen para el zoom */}
            <div className="overflow-hidden h-48 w-full">
                <img 
                    src={p.imagenUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400'} 
                    className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                    alt={p.nombre} 
                />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] text-[#00f2ea] font-bold">{p.categoria?.toUpperCase()}</p>
                <div className="flex gap-3">
                    <button onClick={() => prepararEdicion(p)} className="text-gray-400 hover:text-[#00f2ea] text-xs font-bold">EDITAR</button>
                    <button onClick={() => eliminarJoya(p.id)} className="text-gray-600 hover:text-red-500 text-xs font-bold">X</button>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-4">{p.nombre}</h3>
              <p className="text-2xl font-mono text-[#00f2ea]">${p.precio?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;