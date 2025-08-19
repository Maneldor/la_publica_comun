// Sistema de traducciones para lenguas oficiales de España

export interface Traducciones {
  // Navegación y elementos comunes
  lapublica: string;
  iniciarSesion: string;
  crearCuenta: string;
  continuar: string;
  atras: string;
  cambiar: string;
  
  // Login
  login: {
    accedeAlDashboard: string;
    email: string;
    contraseña: string;
    olvidasteContraseña: string;
    noTienesCuenta: string;
    usuariosPrueba: string;
    hazClicAutocompletar: string;
  };
  
  // Formulario de registro
  registro: {
    titulo: string;
    paso1: string;
    paso2: string;
    datosBasicos: string;
    informacionAdicional: string;
    completarPerfil: string;
    
    // Campos del formulario
    email: string;
    emailRequerido: string;
    nombre: string;
    nombreRequerido: string;
    apellidos: string;
    nickname: string;
    nicknameRequerido: string;
    nicknameDescripcion: string;
    comunidadAutonoma: string;
    comunidadRequerida: string;
    seleccionaComunidad: string;
    contraseña: string;
    contraseñaRequerida: string;
    confirmarContraseña: string;
    confirmar: string;
    minimoCaracteres: string;
    repiteContraseña: string;
    
    organizacion: string;
    organizacionRequerida: string;
    organizacionPlaceholder: string;
    puestoTrabajo: string;
    puestoRequerido: string;
    puestoPlaceholder: string;
    departamento: string;
    departamentoPlaceholder: string;
    
    // Términos y condiciones
    aceptoTerminos: string;
    terminosCondiciones: string;
    politicaPrivacidad: string;
    
    // Enlaces
    yaTienesCuenta: string;
    iniciaAqui: string;
    
    // Modal de confirmación
    confirmaTuComunidad: string;
    hemosDetectado: string;
    eresTrabajador: string;
    siTrabajo: string;
    noTrabajoOtra: string;
    puedesCambiar: string;
  };
  
  // Validaciones y errores
  validacion: {
    completaCampos: string;
    contraseñasNoCoinciden: string;
    contraseñaMinimo: string;
    emailInvalido: string;
    nicknameMinimo: string;
    aceptaTerminos: string;
  };
  
  // Estados y mensajes
  mensajes: {
    registroExitoso: string;
    redirigiendo: string;
    errorRegistro: string;
    errorConexion: string;
    registrando: string;
  };
  
  // Comunidades (en idioma local)
  comunidades: {
    [key: string]: string;
  };
}

// Traducciones en Español (por defecto)
export const es: Traducciones = {
  lapublica: 'La Pública',
  iniciarSesion: 'Iniciar Sesión',
  crearCuenta: 'Crear Cuenta',
  continuar: 'Continuar',
  atras: 'Atrás',
  cambiar: 'Cambiar',
  
  login: {
    accedeAlDashboard: 'Accede a tu dashboard personalizado',
    email: 'Email',
    contraseña: 'Contraseña',
    olvidasteContraseña: '¿Olvidaste tu contraseña?',
    noTienesCuenta: '¿No tienes cuenta?',
    usuariosPrueba: 'Usuarios de Prueba:',
    hazClicAutocompletar: 'Haz clic para autocompletar las credenciales',
  },
  
  registro: {
    titulo: 'Crear Cuenta',
    paso1: 'Paso 1 de 2',
    paso2: 'Paso 2 de 2',
    datosBasicos: 'Datos básicos',
    informacionAdicional: 'Información Adicional',
    completarPerfil: 'Completa tu perfil',
    
    email: 'Email',
    emailRequerido: 'Email *',
    nombre: 'Nombre',
    nombreRequerido: 'Nombre *',
    apellidos: 'Apellidos',
    nickname: 'Nickname',
    nicknameRequerido: 'Nickname *',
    nicknameDescripcion: 'Nombre visible para otros usuarios',
    comunidadAutonoma: 'Comunidad Autónoma',
    comunidadRequerida: 'Comunidad Autónoma *',
    seleccionaComunidad: 'Selecciona tu comunidad',
    contraseña: 'Contraseña',
    contraseñaRequerida: 'Contraseña *',
    confirmarContraseña: 'Confirmar Contraseña',
    confirmar: 'Confirmar *',
    minimoCaracteres: 'Mínimo 6 caracteres',
    repiteContraseña: 'Repite contraseña',
    
    organizacion: 'Organización',
    organizacionRequerida: 'Organización *',
    organizacionPlaceholder: 'Ej: Generalitat de Catalunya, Ayuntamiento de Madrid',
    puestoTrabajo: 'Puesto de Trabajo',
    puestoRequerido: 'Puesto de Trabajo *',
    puestoPlaceholder: 'Ej: Técnico Superior',
    departamento: 'Departamento',
    departamentoPlaceholder: 'Ej: Tecnologías de la Información',
    
    aceptoTerminos: 'Acepto los',
    terminosCondiciones: 'términos y condiciones',
    politicaPrivacidad: 'política de privacidad',
    
    yaTienesCuenta: '¿Ya tienes cuenta?',
    iniciaAqui: 'Inicia sesión aquí',
    
    confirmaTuComunidad: 'Confirma tu Comunidad',
    hemosDetectado: 'Hemos detectado que te conectas desde',
    eresTrabajador: '¿Eres trabajador público de',
    siTrabajo: '✅ Sí, trabajo en',
    noTrabajoOtra: '❌ No, trabajo en otra',
    puedesCambiar: 'Puedes cambiar esta información más tarde si es necesario',
  },
  
  validacion: {
    completaCampos: 'Por favor, completa todos los campos obligatorios',
    contraseñasNoCoinciden: 'Las contraseñas no coinciden',
    contraseñaMinimo: 'La contraseña debe tener al menos 6 caracteres',
    emailInvalido: 'Por favor, introduce un email válido',
    nicknameMinimo: 'El nickname debe tener al menos 3 caracteres',
    aceptaTerminos: 'Debes aceptar los términos y condiciones',
  },
  
  mensajes: {
    registroExitoso: '¡Registro exitoso! Redirigiendo a tu dashboard...',
    redirigiendo: 'Redirigiendo...',
    errorRegistro: 'Error al registrarse',
    errorConexion: 'Error de conexión. Intenta de nuevo.',
    registrando: 'Registrando...',
  },
  
  comunidades: {
    'Andalucía': 'Andalucía',
    'Aragón': 'Aragón',
    'Asturias': 'Asturias',
    'Illes Balears': 'Baleares',
    'Canarias': 'Canarias',
    'Cantabria': 'Cantabria',
    'Castilla-La Mancha': 'Castilla-La Mancha',
    'Castilla y León': 'Castilla y León',
    'Catalunya': 'Cataluña',
    'Comunitat Valenciana': 'Comunidad Valenciana',
    'Extremadura': 'Extremadura',
    'Galicia': 'Galicia',
    'La Rioja': 'La Rioja',
    'Madrid': 'Madrid',
    'Murcia': 'Murcia',
    'Navarra': 'Navarra',
    'Euskadi': 'País Vasco',
  },
};

// Traducciones en Catalán
export const ca: Traducciones = {
  lapublica: 'La Pública',
  iniciarSesion: 'Iniciar Sessió',
  crearCuenta: 'Crear Compte',
  continuar: 'Continuar',
  atras: 'Enrere',
  cambiar: 'Canviar',
  
  login: {
    accedeAlDashboard: 'Accedeix al teu tauler personalitzat',
    email: 'Email',
    contraseña: 'Contrasenya',
    olvidasteContraseña: 'Has oblidat la contrasenya?',
    noTienesCuenta: 'No tens compte?',
    usuariosPrueba: 'Usuaris de Prova:',
    hazClicAutocompletar: 'Fes clic per autocompletar les credencials',
  },
  
  registro: {
    titulo: 'Crear Compte',
    paso1: 'Pas 1 de 2',
    paso2: 'Pas 2 de 2',
    datosBasicos: 'Dades bàsiques',
    informacionAdicional: 'Informació Adicional',
    completarPerfil: 'Completa el teu perfil',
    
    email: 'Email',
    emailRequerido: 'Email *',
    nombre: 'Nom',
    nombreRequerido: 'Nom *',
    apellidos: 'Cognoms',
    nickname: 'Nickname',
    nicknameRequerido: 'Nickname *',
    nicknameDescripcion: 'Nom visible per altres usuaris',
    comunidadAutonoma: 'Comunitat Autònoma',
    comunidadRequerida: 'Comunitat Autònoma *',
    seleccionaComunidad: 'Selecciona la teva comunitat',
    contraseña: 'Contrasenya',
    contraseñaRequerida: 'Contrasenya *',
    confirmarContraseña: 'Confirmar Contrasenya',
    confirmar: 'Confirmar *',
    minimoCaracteres: 'Mínim 6 caràcters',
    repiteContraseña: 'Repeteix contrasenya',
    
    organizacion: 'Organització',
    organizacionRequerida: 'Organització *',
    organizacionPlaceholder: 'Ex: Generalitat de Catalunya, Ajuntament de Barcelona',
    puestoTrabajo: 'Lloc de Treball',
    puestoRequerido: 'Lloc de Treball *',
    puestoPlaceholder: 'Ex: Tècnic Superior',
    departamento: 'Departament',
    departamentoPlaceholder: 'Ex: Tecnologies de la Informació',
    
    aceptoTerminos: 'Accepto els',
    terminosCondiciones: 'termes i condicions',
    politicaPrivacidad: 'política de privacitat',
    
    yaTienesCuenta: 'Ja tens compte?',
    iniciaAqui: 'Inicia sessió aquí',
    
    confirmaTuComunidad: 'Confirma la teva Comunitat',
    hemosDetectado: 'Hem detectat que et connectes des de',
    eresTrabajador: 'Ets treballador públic de',
    siTrabajo: '✅ Sí, treballo a',
    noTrabajoOtra: '❌ No, treballo en una altra',
    puedesCambiar: 'Pots canviar aquesta informació més tard si cal',
  },
  
  validacion: {
    completaCampos: 'Si us plau, completa tots els camps obligatoris',
    contraseñasNoCoinciden: 'Les contrasenyes no coincideixen',
    contraseñaMinimo: 'La contrasenya ha de tenir almenys 6 caràcters',
    emailInvalido: 'Si us plau, introdueix un email vàlid',
    nicknameMinimo: 'El nickname ha de tenir almenys 3 caràcters',
    aceptaTerminos: 'Has d\'acceptar els termes i condicions',
  },
  
  mensajes: {
    registroExitoso: 'Registre exitós! Redirigint al teu tauler...',
    redirigiendo: 'Redirigint...',
    errorRegistro: 'Error en registrar-se',
    errorConexion: 'Error de connexió. Torna-ho a provar.',
    registrando: 'Registrant...',
  },
  
  comunidades: {
    'Andalucía': 'Andalusia',
    'Aragón': 'Aragó',
    'Asturias': 'Astúries',
    'Illes Balears': 'Illes Balears',
    'Canarias': 'Canàries',
    'Cantabria': 'Cantàbria',
    'Castilla-La Mancha': 'Castella-la Manxa',
    'Castilla y León': 'Castella i Lleó',
    'Catalunya': 'Catalunya',
    'Comunitat Valenciana': 'Comunitat Valenciana',
    'Extremadura': 'Extremadura',
    'Galicia': 'Galícia',
    'La Rioja': 'La Rioja',
    'Madrid': 'Madrid',
    'Murcia': 'Múrcia',
    'Navarra': 'Navarra',
    'Euskadi': 'País Basc',
  },
};

// Traducciones en Euskera
export const eu: Traducciones = {
  lapublica: 'La Pública',
  iniciarSesion: 'Saioa Hasi',
  crearCuenta: 'Kontua Sortu',
  continuar: 'Jarraitu',
  atras: 'Atzera',
  cambiar: 'Aldatu',
  
  login: {
    accedeAlDashboard: 'Sartu zure aginte-panel pertsonalizatuan',
    email: 'Email',
    contraseña: 'Pasahitza',
    olvidasteContraseña: 'Pasahitza ahaztu duzu?',
    noTienesCuenta: 'Ez daukazu konturik?',
    usuariosPrueba: 'Proba Erabiltzaileak:',
    hazClicAutocompletar: 'Egin klik kredentzialak automatikoki betetzeko',
  },
  
  registro: {
    titulo: 'Kontua Sortu',
    paso1: '1. urratsa 2tik',
    paso2: '2. urratsa 2tik',
    datosBasicos: 'Oinarrizko datuak',
    informacionAdicional: 'Informazio Gehigarria',
    completarPerfil: 'Zure profila osatu',
    
    email: 'Email',
    emailRequerido: 'Email *',
    nombre: 'Izena',
    nombreRequerido: 'Izena *',
    apellidos: 'Abizenak',
    nickname: 'Nickname',
    nicknameRequerido: 'Nickname *',
    nicknameDescripcion: 'Beste erabiltzaileentzat ikusgai den izena',
    comunidadAutonoma: 'Autonomia Erkidegoa',
    comunidadRequerida: 'Autonomia Erkidegoa *',
    seleccionaComunidad: 'Hautatu zure erkidegoa',
    contraseña: 'Pasahitza',
    contraseñaRequerida: 'Pasahitza *',
    confirmarContraseña: 'Pasahitza Berretsi',
    confirmar: 'Berretsi *',
    minimoCaracteres: 'Gutxienez 6 karaktere',
    repiteContraseña: 'Errepikatu pasahitza',
    
    organizacion: 'Erakundea',
    organizacionRequerida: 'Erakundea *',
    organizacionPlaceholder: 'Ad: Eusko Jaurlaritza, Bilboko Udala',
    puestoTrabajo: 'Lan Postua',
    puestoRequerido: 'Lan Postua *',
    puestoPlaceholder: 'Ad: Teknikari Goia',
    departamento: 'Saila',
    departamentoPlaceholder: 'Ad: Informazio Teknologiak',
    
    aceptoTerminos: 'Onartzen ditut',
    terminosCondiciones: 'termino eta baldintzak',
    politicaPrivacidad: 'pribatutasun politika',
    
    yaTienesCuenta: 'Badaukazu konturik?',
    iniciaAqui: 'Hasi saioa hemen',
    
    confirmaTuComunidad: 'Berretsi zure Erkidegoa',
    hemosDetectado: 'Detektatu dugu hemendik konektatzen zarela:',
    eresTrabajador: 'Langile publikoa al zara',
    siTrabajo: '✅ Bai, hemen lan egiten dut:',
    noTrabajoOtra: '❌ Ez, beste batean lan egiten dut',
    puedesCambiar: 'Informazio hau geroago aldatu dezakezu beharrezkoa bada',
  },
  
  validacion: {
    completaCampos: 'Mesedez, bete derrigorrezko eremu guztiak',
    contraseñasNoCoinciden: 'Pasahitzak ez datoz bat',
    contraseñaMinimo: 'Pasahitzak gutxienez 6 karaktere izan behar ditu',
    emailInvalido: 'Mesedez, sartu baliozko email bat',
    nicknameMinimo: 'Nickname-ak gutxienez 3 karaktere izan behar ditu',
    aceptaTerminos: 'Termino eta baldintzak onartu behar dituzu',
  },
  
  mensajes: {
    registroExitoso: 'Erregistroa arrakastatsua! Zure aginte-panelera bideratzen...',
    redirigiendo: 'Bideratzen...',
    errorRegistro: 'Errorea erregistratzean',
    errorConexion: 'Konexio errorea. Saiatu berriro.',
    registrando: 'Erregistratzen...',
  },
  
  comunidades: {
    'Andalucía': 'Andaluzia',
    'Aragón': 'Aragoia',
    'Asturias': 'Asturiak',
    'Illes Balears': 'Balear Uharteak',
    'Canarias': 'Kanariak',
    'Cantabria': 'Kantabria',
    'Castilla-La Mancha': 'Gaztela-Mantxa',
    'Castilla y León': 'Gaztela eta Leon',
    'Catalunya': 'Katalunia',
    'Comunitat Valenciana': 'Valentziar Erkidegoa',
    'Extremadura': 'Extremadura',
    'Galicia': 'Galizia',
    'La Rioja': 'Errioxa',
    'Madrid': 'Madrid',
    'Murcia': 'Murtzia',
    'Navarra': 'Nafarroa',
    'Euskadi': 'Euskadi',
  },
};

// Traducciones en Gallego
export const gl: Traducciones = {
  lapublica: 'La Pública',
  iniciarSesion: 'Iniciar Sesión',
  crearCuenta: 'Crear Conta',
  continuar: 'Continuar',
  atras: 'Atrás',
  cambiar: 'Cambiar',
  
  login: {
    accedeAlDashboard: 'Accede ao teu panel personalizado',
    email: 'Email',
    contraseña: 'Contrasinal',
    olvidasteContraseña: 'Esqueceches o contrasinal?',
    noTienesCuenta: 'Non tes conta?',
    usuariosPrueba: 'Usuarios de Proba:',
    hazClicAutocompletar: 'Fai clic para autocompletar as credenciais',
  },
  
  registro: {
    titulo: 'Crear Conta',
    paso1: 'Paso 1 de 2',
    paso2: 'Paso 2 de 2',
    datosBasicos: 'Datos básicos',
    informacionAdicional: 'Información Adicional',
    completarPerfil: 'Completa o teu perfil',
    
    email: 'Email',
    emailRequerido: 'Email *',
    nombre: 'Nome',
    nombreRequerido: 'Nome *',
    apellidos: 'Apelidos',
    nickname: 'Nickname',
    nicknameRequerido: 'Nickname *',
    nicknameDescripcion: 'Nome visible para outros usuarios',
    comunidadAutonoma: 'Comunidade Autónoma',
    comunidadRequerida: 'Comunidade Autónoma *',
    seleccionaComunidad: 'Selecciona a túa comunidade',
    contraseña: 'Contrasinal',
    contraseñaRequerida: 'Contrasinal *',
    confirmarContraseña: 'Confirmar Contrasinal',
    confirmar: 'Confirmar *',
    minimoCaracteres: 'Mínimo 6 caracteres',
    repiteContraseña: 'Repite contrasinal',
    
    organizacion: 'Organización',
    organizacionRequerida: 'Organización *',
    organizacionPlaceholder: 'Ex: Xunta de Galicia, Concello da Coruña',
    puestoTrabajo: 'Posto de Traballo',
    puestoRequerido: 'Posto de Traballo *',
    puestoPlaceholder: 'Ex: Técnico Superior',
    departamento: 'Departamento',
    departamentoPlaceholder: 'Ex: Tecnoloxías da Información',
    
    aceptoTerminos: 'Acepto os',
    terminosCondiciones: 'termos e condicións',
    politicaPrivacidad: 'política de privacidade',
    
    yaTienesCuenta: 'Xa tes conta?',
    iniciaAqui: 'Inicia sesión aquí',
    
    confirmaTuComunidad: 'Confirma a túa Comunidade',
    hemosDetectado: 'Detectamos que te conectas dende',
    eresTrabajador: 'Es traballador público de',
    siTrabajo: '✅ Si, traballo en',
    noTrabajoOtra: '❌ Non, traballo noutra',
    puedesCambiar: 'Podes cambiar esta información máis tarde se é necesario',
  },
  
  validacion: {
    completaCampos: 'Por favor, completa todos os campos obrigatorios',
    contraseñasNoCoinciden: 'Os contrasinais non coinciden',
    contraseñaMinimo: 'O contrasinal debe ter polo menos 6 caracteres',
    emailInvalido: 'Por favor, introduce un email válido',
    nicknameMinimo: 'O nickname debe ter polo menos 3 caracteres',
    aceptaTerminos: 'Debes aceptar os termos e condicións',
  },
  
  mensajes: {
    registroExitoso: 'Rexistro exitoso! Redirexindo ao teu panel...',
    redirigiendo: 'Redirexindo...',
    errorRegistro: 'Erro ao rexistrarse',
    errorConexion: 'Erro de conexión. Téntao de novo.',
    registrando: 'Rexistrando...',
  },
  
  comunidades: {
    'Andalucía': 'Andalucía',
    'Aragón': 'Aragón',
    'Asturias': 'Asturias',
    'Illes Balears': 'Illas Baleares',
    'Canarias': 'Canarias',
    'Cantabria': 'Cantabria',
    'Castilla-La Mancha': 'Castela-A Mancha',
    'Castilla y León': 'Castela e León',
    'Catalunya': 'Cataluña',
    'Comunitat Valenciana': 'Comunidade Valenciana',
    'Extremadura': 'Extremadura',
    'Galicia': 'Galicia',
    'La Rioja': 'A Rioxa',
    'Madrid': 'Madrid',
    'Murcia': 'Murcia',
    'Navarra': 'Navarra',
    'Euskadi': 'País Vasco',
  },
};

// Mapeo de idiomas
export const traducciones = {
  es,
  ca,
  eu,
  gl,
};

export type IdiomaDisponible = keyof typeof traducciones;