import React, { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import clienteAxios from '../config/axios';
import appContext from '../context/app/appContext';
import authContext from '../context/auth/authContext';
import Formulario from '../components/Formulario';

const Dropzone = () => {

     // Context de la app
     const AppContext = useContext(appContext);
     const { cargando, mostrarAlerta, subirArchivos, crearEnlace } = AppContext;
     
     // Context de autenticacion
     const AuthContext = useContext(authContext);
     const { usuario, autenticado } = AuthContext;

     const onDropRejected = () => {
          mostrarAlerta('No se pudo subir, el Limite es de 1MB, obten una cuenta gratis para subir archivos mas grandes');
     }

     const onDropAccepted = useCallback( async (acceptedFiles) => {
          // Crear un objeto de tipo form Data
          const formData = new FormData();
          formData.append('archivo', acceptedFiles[0]);

          subirArchivos(formData, acceptedFiles[0].path);
     }, []);
     

     // Extraer contenido de Dropzone   
     const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({onDropAccepted, onDropRejected, maxSize: 1000000});

     const archivos = acceptedFiles.map( archivo => (
          <li key={archivo.lastModified} className="bg-white flex-1 p-3 mb-4 shadow-lg rounded" >
               <p className="font-bold text-xl">{archivo.path}</p>
               <p className="text-sm text-gray-500">{ (archivo.size / Math.pow(1024, 2)).toFixed(2 ) } MB</p>
          </li>
     ));
     

     return ( 
          <div className="md:flex-1 mb-3 mx-2 mt-16 lg:mt-0 flex flex-col items-center justify-center border-dashed border-gray-400 border-2 px-4 bg-gray-100">
            
            { acceptedFiles.length > 0 ? (
                 <>
                 <div className="mt-10 w-full">
                    <h4 className="text-2xl font-bold text-center mb-4">Archivos</h4>  
                    <ul>
                         {archivos}
                    </ul>

                    {
                         autenticado ? < Formulario />: ""
                    }

                    { cargando ? <p className="my-10 text-center text-gray-600">Subiendo Archivo...</p> : (
                         <button 
                         type="button"
                         className="bg-black w-full py-2  text-white my-10 hover:bg-gray-500" type="button"
                         onClick={ () => crearEnlace() }
                         >
                              Crear Enlace
                         </button>
                    )}

                    
                 </div>
                 </>
               ) : (
                    <div { ...getRootProps({ className: 'dropzone w-full py-32' })}>
                         <input className="h-100" { ...getInputProps()} />
                         
                              {
                                   isDragActive ? <p className="text-2xl text-center text-gray-600">Suelta el archivo</p> :
                                   <div className="text-center">
                                        <p className="text-2xl text-center text-gray-400">Selecciona un archivo y arrastralo aquí</p>
                                        <button className="bg-black w-full py-2  text-white my-10 hover:bg-gray-500" type="button">
                                             Selecciona archivos para subir
                                        </button>
                                   </div>
                              }
                    </div>
               )
            }
          </div>
      );
}
 
export default Dropzone;