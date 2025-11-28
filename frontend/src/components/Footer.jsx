// src/components/Footer.jsx
import { useState } from "react";
import Modal from "./Modal";
import { Shield, Lock, Eye, FileCheck, AlertTriangle, LogIn, LogOut } from "lucide-react";

function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    setIsPrivacyModalOpen(true);
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setIsTermsModalOpen(true);
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full bg-[#000000] text-white shadow-md py-3 z-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm">
          {/* Texto principal */}
          <p className="text-center sm:text-left font-medium tracking-wide">
            &copy; {new Date().getFullYear()} COTECNOVA — Todos los derechos
            reservados
          </p>

          {/* Enlaces adicionales */}
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <a
              href="#"
              onClick={handlePrivacyClick}
              className="hover:text-green-200 transition duration-300"
            >
              Políticas de Privacidad
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="#"
              onClick={handleTermsClick}
              className="hover:text-green-200 transition duration-300"
            >
              Términos de Uso
            </a>
          </div>
        </div>
      </footer>

      {/* Modal de Políticas de Privacidad */}
      {isPrivacyModalOpen && (
        <Modal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
          size="xl"
        >
          {/* Encabezado fijo fuera del scroll */}
          <div className="flex items-center gap-3 pb-4 border-b mb-4 px-12">
            <Shield className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Políticas de Privacidad y Tratamiento de Datos
            </h2>
          </div>

          {/* Contenido con scroll */}
          <div className="max-h-[60vh] overflow-y-auto px-12 pr-8">
            <div className="space-y-6 text-gray-700">
              {/* Introducción */}
              <section>
                <p className="leading-relaxed mb-3">
                  La <span className="font-semibold">Corporación de Estudios Tecnológicos del Norte del Valle - COTECNOVA</span>, 
                  como institución de educación superior, se compromete con la protección y confidencialidad de los datos 
                  personales de estudiantes, docentes, personal administrativo y visitantes.
                </p>
                <p className="leading-relaxed">
                  Nuestro sistema de gestión de parqueaderos cumple con la{" "}
                  <span className="font-semibold text-green-700">Ley 1581 de 2012</span> (Habeas Data), 
                  el <span className="font-semibold text-green-700">Decreto 1377 de 2013</span>, y los estándares 
                  internacionales <span className="font-semibold text-green-700">ISO/IEC 27001</span>, 
                  garantizando la seguridad de la información de nuestra comunidad académica.
                </p>
              </section>

              {/* Sección 1: Recopilación de Datos */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3 mb-2">
                  <FileCheck className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      1. Información que Recopilamos
                    </h3>
                    <p className="mb-2">
                      Para brindar servicios de parqueadero a la comunidad académica, recopilamos:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Nombre completo y número de identificación (cédula, documento)</li>
                      <li>Número de teléfono de contacto</li>
                      <li>Vinculación con la institución (estudiante, docente, administrativo, visitante)</li>
                      <li>Información del vehículo (placa, modelo, marca, color)</li>
                      <li>Registros de fecha y hora de ingreso y salida al campus</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Sección 2: Uso de la Información */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3 mb-2">
                  <Eye className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      2. Finalidad del Tratamiento de Datos
                    </h3>
                    <p className="mb-2">Sus datos personales son utilizados exclusivamente para:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Control de acceso vehicular al campus universitario</li>
                      <li>Identificación de vehículos autorizados y sus propietarios</li>
                      <li>Garantizar la seguridad de las instalaciones y la comunidad académica</li>
                      <li>Generación de reportes estadísticos y administrativos</li>
                      <li>Cumplimiento de obligaciones legales y normativas institucionales</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Sección 3: Medidas de Seguridad ISO 27001 */}
              <section className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3 mb-2">
                  <Lock className="w-5 h-5 text-green-700 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      3. Medidas de Seguridad (ISO/IEC 27001)
                    </h3>
                    <p className="mb-2">
                      COTECNOVA implementa controles de seguridad de la información alineados con el estándar ISO/IEC 27001:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        <span className="font-semibold">Cifrado de datos:</span>{" "}
                        Protección mediante cifrado de contraseñas y datos sensibles
                      </li>
                      <li>
                        <span className="font-semibold">Control de acceso:</span>{" "}
                        Acceso restringido al sistema únicamente para personal autorizado
                      </li>
                      <li>
                        <span className="font-semibold">Trazabilidad y auditoría:</span>{" "}
                        Registro detallado de todas las operaciones en el sistema
                      </li>
                      <li>
                        <span className="font-semibold">Respaldo de información:</span>{" "}
                        Copias de seguridad automáticas y periódicas
                      </li>
                      <li>
                        <span className="font-semibold">Infraestructura segura:</span>{" "}
                        Servidores alojados en ambientes controlados y protegidos
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Sección 4: Derechos del Usuario */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  4. Derechos del Titular (Ley 1581 de 2012)
                </h3>
                <p className="mb-2">
                  De conformidad con la legislación colombiana, usted tiene derecho a:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-semibold">Conocer, actualizar y rectificar</span> sus datos personales</li>
                  <li><span className="font-semibold">Solicitar prueba</span> de la autorización otorgada</li>
                  <li><span className="font-semibold">Ser informado</span> sobre el uso dado a sus datos personales</li>
                  <li><span className="font-semibold">Presentar quejas</span> ante la Superintendencia de Industria y Comercio</li>
                  <li><span className="font-semibold">Revocar la autorización</span> o solicitar la supresión de datos</li>
                  <li><span className="font-semibold">Acceder gratuitamente</span> a sus datos personales</li>
                </ul>
              </section>

              {/* Sección 5: Retención de Datos */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  5. Conservación y Eliminación de Datos
                </h3>
                <p>
                  Los datos personales serán conservados durante el tiempo que la persona mantenga vínculo con la 
                  institución, más el tiempo que establezcan las normas aplicables. Una vez cumplido el período de 
                  retención y agotadas las obligaciones legales, los datos serán eliminados de forma segura conforme 
                  a protocolos institucionales de destrucción de información.
                </p>
              </section>

              {/* Advertencia */}
              <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Confidencialidad y Responsabilidad
                    </h3>
                    <p className="text-sm">
                      COTECNOVA no compartirá, venderá ni divulgará sus datos personales a terceros, salvo en los 
                      casos expresamente autorizados por usted, por mandato legal, orden judicial o requerimiento 
                      de autoridad competente. El tratamiento de datos se realiza bajo estrictos protocolos de 
                      confidencialidad y seguridad de la información.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contacto */}
              <section className="text-center pt-4 border-t">
                <p className="text-sm text-gray-700 font-semibold mb-1">
                  Área de Protección de Datos Personales
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Para ejercer sus derechos o consultas sobre el tratamiento de datos personales, 
                  contacte a nuestra Oficina de Protección de Datos.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Corporación de Estudios Tecnológicos del Norte del Valle - COTECNOVA
                </p>
                <p className="text-xs text-gray-500">
                  Última actualización: {new Date().toLocaleDateString("es-CO", { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </section>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Términos de Uso */}
      {isTermsModalOpen && (
        <Modal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
          size="xl"
        >
          {/* Encabezado fijo fuera del scroll */}
          <div className="flex items-center gap-3 pb-4 border-b mb-4 px-12">
            <FileCheck className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Términos de Uso - Sistema de Parqueaderos
            </h2>
          </div>

          {/* Contenido con scroll */}
          <div className="max-h-[60vh] overflow-y-auto px-12 pr-8">
            <div className="space-y-6 text-gray-700">
              {/* Introducción */}
              <section>
                <p className="leading-relaxed mb-3">
                  Bienvenido al <span className="font-semibold">Sistema de Gestión de Parqueaderos</span> de 
                  la Corporación de Estudios Tecnológicos del Norte del Valle - COTECNOVA.
                </p>
                <p className="leading-relaxed">
                  Este sistema permite gestionar de forma eficiente y segura el acceso vehicular al campus 
                  universitario. A continuación, encontrará las instrucciones de uso y normativa aplicable.
                </p>
              </section>

              {/* Sección 1: Usuarios Autorizados */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  1. Usuarios Autorizados
                </h3>
                <p className="mb-2">El sistema de parqueaderos está disponible para:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-semibold">Estudiantes activos</span> con matrícula vigente</li>
                  <li><span className="font-semibold">Docentes</span> vinculados a la institución</li>
                  <li><span className="font-semibold">Personal administrativo</span> de COTECNOVA</li>
                  <li><span className="font-semibold">Visitantes autorizados</span> previamente registrados</li>
                </ul>
              </section>

              {/* Sección 2: Registro de Ingresos */}
              <section className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-green-600" />
                  2. Cómo Registrar un Ingreso
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li className="font-semibold">Proporcionar identificación</li>
                  <p className="ml-6 text-sm mb-2">
                    El personal de vigilancia solicitará su número de cédula o documento de identidad.
                  </p>
                  
                  <li className="font-semibold">Buscar en el sistema</li>
                  <p className="ml-6 text-sm mb-2">
                    El vigilante ingresará su número de identificación en el campo "Número de identificación" 
                    y presionará el botón <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Buscar</span>.
                  </p>
                  
                  <li className="font-semibold">Seleccionar vehículo</li>
                  <p className="ml-6 text-sm mb-2">
                    Si tiene varios vehículos registrados, seleccione el vehículo con el que ingresa al campus.
                  </p>
                  
                  <li className="font-semibold">Confirmar ingreso</li>
                  <p className="ml-6 text-sm mb-2">
                    El sistema registrará la fecha y hora de ingreso automáticamente.
                  </p>
                </ol>
              </section>

              {/* Sección 3: Registro de Salidas */}
              <section className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-red-600" />
                  3. Cómo Registrar una Salida
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li className="font-semibold">Proporcionar identificación en la salida</li>
                  <p className="ml-6 text-sm mb-2">
                    Al salir del campus, proporcione nuevamente su número de cédula al personal de vigilancia.
                  </p>
                  
                  <li className="font-semibold">Registro automático</li>
                  <p className="ml-6 text-sm mb-2">
                    El sistema identificará automáticamente el vehículo con ingreso activo y registrará 
                    la salida con fecha y hora exactas.
                  </p>
                  
                  <li className="font-semibold">Confirmación</li>
                  <p className="ml-6 text-sm mb-2">
                    Se mostrará un mensaje de confirmación de salida exitosa.
                  </p>
                </ol>
              </section>

              {/* Sección 4: Normas del Parqueadero */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  4. Normas del Parqueadero
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Los vehículos deben estar debidamente registrados en el sistema antes del primer ingreso</li>
                  <li>Es obligatorio presentar documento de identidad en cada ingreso y salida</li>
                  <li>El espacio de parqueadero es limitado y se asigna por orden de llegada</li>
                  <li>COTECNOVA no se hace responsable por objetos dejados dentro de los vehículos</li>
                  <li>Respetar las señalizaciones y velocidad máxima dentro del campus (10 km/h)</li>
                  <li>No está permitido el parqueo en zonas no autorizadas</li>
                  <li>El horario de acceso vehicular es de lunes a viernes de 6:00 AM a 10:00 PM</li>
                </ul>
              </section>

              {/* Sección 5: Registro de Vehículos */}
              <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  5. Registro de Nuevos Vehículos
                </h3>
                <p className="mb-2">
                  Si desea registrar un vehículo nuevo o actualizar la información de su vehículo actual, 
                  debe:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Dirigirse a la Oficina de Servicios Generales</li>
                  <li>Presentar cédula de ciudadanía y tarjeta de propiedad del vehículo</li>
                  <li>Completar el formulario de registro vehicular</li>
                  <li>Esperar la confirmación de registro (24-48 horas hábiles)</li>
                </ol>
              </section>

              {/* Advertencia */}
              <section className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      Importante
                    </h3>
                    <p className="text-sm">
                      El incumplimiento de estas normas puede resultar en la suspensión temporal o 
                      permanente del acceso al parqueadero. COTECNOVA se reserva el derecho de modificar 
                      estas condiciones previo aviso a la comunidad académica.
                    </p>
                  </div>
                </div>
              </section>

              {/* Soporte y Contacto */}
              <section className="text-center pt-4 border-t">
                <p className="text-sm text-gray-700 font-semibold mb-1">
                  Soporte Técnico y Consultas
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Para soporte técnico, reporte de problemas o consultas sobre el uso del sistema, 
                  contacte a la Oficina de Servicios Generales.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Corporación de Estudios Tecnológicos del Norte del Valle - COTECNOVA
                </p>
                <p className="text-xs text-gray-500">
                  Actualizado: {new Date().toLocaleDateString("es-CO", { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </section>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Footer;
