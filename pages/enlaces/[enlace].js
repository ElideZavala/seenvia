import Layout from '../../components/Layout';
import clienteAxios from '../../config/axios';
import React, { useState, useContext } from 'react';
import appContext from '../../context/app/appContext';
import Alerta from '../../components/Alerta';

export async function getServerSideProps({params}) {  // Nos traera los datos al momento de visitar la pagina. 
     const { enlace } = params; 

     const resultado = await clienteAxios.get(`/api/enlaces/${enlace}`);

     // console.log(resultado);

     return {
          props: {
               enlace: resultado.data
          }
     }
}

export async function getServerSidePaths() {  // Se crea para saber que paginas seran creadas.
     const enlaces = await clienteAxios.get('/api/enlaces');
     return {
          paths: enlaces.data.enlaces.map( enlace => ( {
               params: { enlace : enlace.url}  // nos agrega una url por cada uno de los enlaces.
          })),
          fallback: false
     }
}

export default ({enlace}) => {

      // Context de la app
      const AppContext = useContext(appContext);
      const { mostrarAlerta, mensaje_archivo} = AppContext;

     const [ tienePassword, setTienePassword ] = useState(enlace.password);
     const [ password, setPassword ] = useState('');

     console.log(tienePassword);

     // console.log(enlace)

     const verificarPassword = async (e) => {
          e.preventDefault();

          const data = {
               password
          }

          try {
               const resultado = await clienteAxios.post(`/api/enlaces/${enlace.enlace}`, data);
               setTienePassword(resultado.data.password);
          } catch (error) {
               mostrarAlerta(error.response.data.msg)
          }
     }
     return (
          <Layout>
               {
                    tienePassword ? (
                         <>
                              <p className="text-center">Este enlace esta protegido por un password, colocalo a continuación</p>

                              { mensaje_archivo && <Alerta />}
                              
                              <div className="flex justify-center mt-5">
                                   <div className="w-full max-w-lg">
                                        <form 
                                             className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                                             onSubmit={ e => verificarPassword(e) }
                                        > 
                                             <div className="mb-4">
                                                  <label 
                                                       className="block text-black text-sm font-bold mb-2"
                                                       htmlFor="password"
                                                  >Password</label>
                                                  <input 
                                                       type="password"
                                                       className="shadow appeareance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                       id="password"
                                                       placeholder="Password del enlace"
                                                       value={password}
                                                       onChange={e => setPassword(e.target.value)}
                                                  />
                                             </div>

                                             <input
                                                  type="submit"
                                                  className="bg-blue-800 hover:bg-gray-900 w-full p-2 text-white uppercase font-bold"
                                                  value="Validar Password..." 
                                             /> 
                                        </form>
                                   </div>
                              </div>
                         </>
                    ) :
                    (
                         <>
                              <h1 className="text-4xl text-center text-gray-700">Descarga tu archivo:</h1>
                              <div className="flex items-center justify-center mt-10">
                                   <a href={`${process.env.backendURL}/api/archivos/${enlace.archivo}`}className="bg-blue-800 text-center px-10 py-2 rounded uppercase font-bold text-white cursor-pointer">Aquí</a>
                              </div>
                         </>
                    )
               }

               
          </Layout>
     )
}