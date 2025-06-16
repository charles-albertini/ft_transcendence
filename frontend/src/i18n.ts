import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    // Navigation
    gameTitle: 'ft_transcendence',
    home: 'Home',
    play: 'Play',
    profile: 'Profile',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Logout',
    
    // Messages de navigation
    redirectingToSignIn: 'Redirecting to sign in...',
    redirectingToSignUp: 'Redirecting to sign up...',
    
    // Page d'accueil
    welcomeTitle: 'Welcome to ft_transcendence',
    gameDescription: 'Experience the classic Pong game with a billiard twist',
    feature1Title: 'Classic Gameplay',
    feature1Description: 'Play against intelligent AI',
    feature2Title: 'Multiplayer',
    feature2Description: 'Play against your friends',
    feature3Title: 'Competitive Play',
    feature3Description: 'Participate in tournaments',
    feature4Title: 'My Profile',
    feature4Description: 'Manage your account',
    
    // Messages pour popup de profil
    accessRestricted: 'Access Restricted',
    profileAccessTitle: 'Profile Access',
    profileLoginRequired: 'You must be logged in to access your profile and manage your game statistics.',
    profileStatsFeature: 'Game statistics',
    profileAchievementsFeature: 'Achievements and rewards',
    profileSettingsFeature: 'Custom settings',
    
    // Boutons d'action
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    startPlaying: 'Start Playing',
    
    // Authentification
    backToHome: 'Back to Home',
    signInTitle: 'Sign In',
    signInSubtitle: 'Welcome back to Billiard Pong',
    signUpTitle: 'Sign Up',
    signUpSubtitle: 'Create your Billiard Pong account',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    firstName: 'First Name',
    firstNamePlaceholder: 'Enter your first name',
    lastName: 'Last Name',
    lastNamePlaceholder: 'Enter your last name',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signingIn: 'Signing in...',
    creatingAccount: 'Creating account...',
    createAccount: 'Create Account',
    orContinueWith: 'or continue with',
    googleSignIn: 'Sign in with Google',
    googleSignUp: 'Sign up with Google',
    noAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    acceptTerms: 'I accept the',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
    
    // 2FA / Authentification à deux facteurs
    twoFactorAuth: 'Two-Factor Authentication',
    enter2FACode: 'Please enter the 6-digit code from your authenticator app',
    authCode: 'Authentication Code',
    sixDigitCode: '000000',
    verifying: 'Verifying...',
    verify: 'Verify',
    twoFARequired: '2FA authentication required',
    invalid2FACode: 'Invalid 2FA code',
    twoFAVerificationError: '2FA verification error',
    loginSuccessful: 'Login successful!',
    loginProcessingError: 'Error processing login',
    
    // Setup 2FA
    twoFactorSetup: 'Two-Factor Authentication Setup',
    twoFactorDescription: 'Add an extra layer of security to your account',
    enableTwoFactor: 'Enable Two-Factor Authentication',
    twoFactorBenefit: 'Protect your account with an additional security layer',
    generatingQRCode: 'Generating QR Code...',
    setupInstructions: 'Setup Instructions',
    downloadAuthApp: 'Download an authenticator app (Google Authenticator, Authy, etc.)',
    scanQRCode: 'Scan the QR code with your authenticator app',
    enterVerificationCode: 'Enter the verification code below',
    qrCodeAlt: 'QR Code for 2FA setup',
    cantScanQR: 'Can\'t scan the QR code?',
    showSecret: 'Show manual entry key',
    hideSecret: 'Hide manual entry key',
    copy: 'Copy',
    copied: 'Copied!',
    verifySetup: 'Verify Setup',
    enterSixDigitCode: 'Enter 6-digit code',
    invalidCode: 'Invalid verification code',
    verificationError: 'Verification error',
    codeMustBe6Digits: 'Code must be exactly 6 digits',
    codeOnlyDigits: 'Code must contain only digits (0-9)',
    twoFactorEnabled: 'Two-factor authentication enabled successfully!',
    skipForNow: 'Skip for now',
    complete: 'Complete',
    continue: 'Continue',
    
    // Messages d'inscription
    username: 'Username',
    signingUp: 'Signing up...',
    registrationSuccessful: 'Registration successful!',
    registrationError: 'Registration error',
    allFieldsRequired: 'All fields are required',
    passwordsDoNotMatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 8 characters',
    
    // Messages d'erreur
    invalidCredentials: 'Invalid credentials',
    connectionError: 'Connection error',
    signupError: 'Signup error',
    passwordMismatch: 'Passwords do not match',
    tooManyAttempts: 'Too many attempts. Please try again later.',
    serverError: 'Server error. Please try again later.',
    
    // Force du mot de passe
    passwordWeak: 'Weak',
    passwordMedium: 'Medium',
    passwordStrong: 'Strong',
    
    // Messages non implémentés
    googleSignInNotImplemented: 'Google Sign In not implemented yet',
    googleSignUpNotImplemented: 'Google Sign Up not implemented yet',
    forgotPasswordNotImplemented: 'Forgot password not implemented yet',
    termsNotImplemented: 'Terms not implemented yet',
    privacyNotImplemented: 'Privacy policy not implemented yet',
    
    // Jeu
    player1: 'Player 1',
    player2: 'Player 2',
    score: 'Score',
    gameOver: 'Game Over',
    winner: 'Winner',
    playAgain: 'Play Again',
    pause: 'Pause',
    resume: 'Resume',
    
    // Profil
    profileTitle: 'Profile',
    statistics: 'Statistics',
    gamesPlayed: 'Games Played',
    gamesWon: 'Games Won',
    winRate: 'Win Rate',
    bestScore: 'Best Score',
    
    // Profil utilisateur détaillé
    changeAvatar: 'Change Avatar',
    rank: 'Rank',
    enterUsername: 'Enter username',
    level: 'Level',
    pongRating: 'Pong Rating',
    status: 'Status',
    online: 'Online',
    memberSince: 'Member Since',
    title: 'Title',
    saveProfile: 'Save Profile',
    
    // Statistiques Pong
    pongStatistics: 'Pong Statistics',
    matchesPlayed: 'Matches Played',
    victories: 'Victories',
    rating: 'Rating',
    winRateEvolution: 'Win Rate Evolution',
    pongSkills: 'Pong Skills',
    ballControl: 'Ball Control',
    defensivePlay: 'Defensive Play',
    aggressivePlay: 'Aggressive Play',
    reactionTime: 'Reaction Time',
    accuracy: 'Accuracy',
    consistency: 'Consistency',
    
    // Historique des matches
    matchHistory: 'Match History',
    opponent: 'Opponent',
    duration: 'Duration',
    result: 'Result',
    win: 'Win',
    loss: 'Loss',
    points: 'Points',
    
    // Activité quotidienne
    dailyActivity: 'Daily Activity',
    totalThisWeek: 'Total This Week',
    avgPerDay: 'Average Per Day',
    bestDay: 'Best Day',
    
    // Boutons d'action profil
    playGame: 'Play Game',
    exportStats: 'Export Stats',
    
    // États de l'interface
    loading: 'Loading',
    current: 'Current',
    
    // Boutons de jeu
    playPong: 'Play Pong'
  },
  fr: {
    // Navigation
    gameTitle: 'ft_transcendence',
    home: 'Accueil',
    play: 'Jouer',
    profile: 'Profil',
    signIn: 'Connexion',
    signUp: 'Inscription',
    logout: 'Déconnexion',
    
    // Messages de navigation
    redirectingToSignIn: 'Redirection vers la connexion...',
    redirectingToSignUp: 'Redirection vers l\'inscription...',
    
    // Page d'accueil
    welcomeTitle: 'Bienvenue sur ft_transcendence',
    gameDescription: 'Découvrez le jeu Pong classique avec une touche de billard',
    feature1Title: 'Gameplay Classique',
    feature1Description: 'Jouer contre une IA intelligente',
    feature2Title: 'Multijoueur',
    feature2Description: 'Jouez contre vos amis',
    feature3Title: 'Jeu Compétitif',
    feature3Description: 'Participez à des tournois',
    feature4Title: 'Mon Profil',
    feature4Description: 'Gérez votre compte',
    
    // Messages pour popup de profil
    accessRestricted: 'Accès restreint',
    profileAccessTitle: 'Accès au Profil',
    profileLoginRequired: 'Vous devez être connecté pour accéder à votre profil et gérer vos statistiques de jeu.',
    profileStatsFeature: 'Statistiques de jeu',
    profileAchievementsFeature: 'Succès et récompenses',
    profileSettingsFeature: 'Paramètres personnalisés',
    
    // Boutons d'action
    getStarted: 'Commencer',
    learnMore: 'En savoir plus',
    startPlaying: 'Commencer à jouer',
    
    // Authentification
    backToHome: 'Retour à l\'accueil',
    signInTitle: 'Connexion',
    signInSubtitle: 'Bienvenue sur Pong Billard',
    signUpTitle: 'Inscription',
    signUpSubtitle: 'Créez votre compte Pong Billard',
    email: 'Email',
    emailPlaceholder: 'Entrez votre email',
    password: 'Mot de passe',
    passwordPlaceholder: 'Entrez votre mot de passe',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Entrez votre prénom',
    lastName: 'Nom',
    lastNamePlaceholder: 'Entrez votre nom',
    confirmPassword: 'Confirmer le mot de passe',
    confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié ?',
    signingIn: 'Connexion...',
    creatingAccount: 'Création du compte...',
    createAccount: 'Créer un compte',
    orContinueWith: 'ou continuer avec',
    googleSignIn: 'Se connecter avec Google',
    googleSignUp: 'S\'inscrire avec Google',
    noAccount: 'Pas de compte ?',
    alreadyHaveAccount: 'Déjà un compte ?',
    acceptTerms: 'J\'accepte les',
    termsOfService: 'Conditions d\'utilisation',
    and: 'et la',
    privacyPolicy: 'Politique de confidentialité',
    
    // 2FA / Authentification à deux facteurs
    twoFactorAuth: 'Authentification à deux facteurs',
    enter2FACode: 'Veuillez entrer le code à 6 chiffres de votre application d\'authentification',
    authCode: 'Code d\'authentification',
    sixDigitCode: '000000',
    verifying: 'Vérification...',
    verify: 'Vérifier',
    twoFARequired: 'Authentification 2FA requise',
    invalid2FACode: 'Code 2FA invalide',
    twoFAVerificationError: 'Erreur de vérification 2FA',
    loginSuccessful: 'Connexion réussie !',
    loginProcessingError: 'Erreur lors du traitement de la connexion',
    
    // Configuration 2FA
    twoFactorSetup: 'Configuration de l\'authentification à deux facteurs',
    twoFactorDescription: 'Ajoutez une couche de sécurité supplémentaire à votre compte',
    enableTwoFactor: 'Activer l\'authentification à deux facteurs',
    twoFactorBenefit: 'Protégez votre compte avec une couche de sécurité supplémentaire',
    generatingQRCode: 'Génération du code QR...',
    setupInstructions: 'Instructions de configuration',
    downloadAuthApp: 'Téléchargez une application d\'authentification (Google Authenticator, Authy, etc.)',
    scanQRCode: 'Scannez le code QR avec votre application d\'authentification',
    enterVerificationCode: 'Entrez le code de vérification ci-dessous',
    qrCodeAlt: 'Code QR pour la configuration 2FA',
    cantScanQR: 'Impossible de scanner le code QR ?',
    showSecret: 'Afficher la clé de saisie manuelle',
    hideSecret: 'Masquer la clé de saisie manuelle',
    copy: 'Copier',
    copied: 'Copié !',
    verifySetup: 'Vérifier la configuration',
    enterSixDigitCode: 'Entrez le code à 6 chiffres',
    invalidCode: 'Code de vérification invalide',
    verificationError: 'Erreur de vérification',
    codeMustBe6Digits: 'Le code doit contenir exactement 6 chiffres',
    codeOnlyDigits: 'Le code ne doit contenir que des chiffres (0-9)',
    twoFactorEnabled: 'Authentification à deux facteurs activée avec succès !',
    skipForNow: 'Ignorer pour l\'instant',
    complete: 'Terminer',
    continue: 'Continuer',
    
    // Messages d'inscription
    username: 'Nom d\'utilisateur',
    signingUp: 'Inscription...',
    registrationSuccessful: 'Inscription réussie !',
    registrationError: 'Erreur d\'inscription',
    allFieldsRequired: 'Tous les champs sont requis',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
    
    // Messages d'erreur
    invalidCredentials: 'Identifiants invalides',
    connectionError: 'Erreur de connexion',
    signupError: 'Erreur d\'inscription',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    
    // Force du mot de passe
    passwordWeak: 'Faible',
    passwordMedium: 'Moyen',
    passwordStrong: 'Fort',
    
    // Messages non implémentés
    googleSignInNotImplemented: 'Connexion Google pas encore implémentée',
    googleSignUpNotImplemented: 'Inscription Google pas encore implémentée',
    forgotPasswordNotImplemented: 'Mot de passe oublié pas encore implémenté',
    termsNotImplemented: 'Conditions pas encore implémentées',
    privacyNotImplemented: 'Politique de confidentialité pas encore implémentée',
    
    // Jeu
    player1: 'Joueur 1',
    player2: 'Joueur 2',
    score: 'Score',
    gameOver: 'Fin de partie',
    winner: 'Gagnant',
    playAgain: 'Rejouer',
    pause: 'Pause',
    resume: 'Reprendre',
    
    // Profil
    profileTitle: 'Profil',
    statistics: 'Statistiques',
    gamesPlayed: 'Parties jouées',
    gamesWon: 'Parties gagnées',
    winRate: 'Taux de victoire',
    bestScore: 'Meilleur score',
    
    // Profil utilisateur détaillé
    changeAvatar: 'Changer l\'avatar',
    rank: 'Rang',
    enterUsername: 'Entrez le nom d\'utilisateur',
    level: 'Niveau',
    pongRating: 'Classement Pong',
    status: 'Statut',
    online: 'En ligne',
    memberSince: 'Membre depuis',
    title: 'Titre',
    saveProfile: 'Sauvegarder le profil',
    
    // Statistiques Pong
    pongStatistics: 'Statistiques Pong',
    matchesPlayed: 'Matches jouées',
    victories: 'Victoires',
    rating: 'Classement',
    winRateEvolution: 'Évolution du taux de victoire',
    pongSkills: 'Compétences Pong',
    ballControl: 'Contrôle de balle',
    defensivePlay: 'Jeu défensif',
    aggressivePlay: 'Jeu agressif',
    reactionTime: 'Temps de réaction',
    accuracy: 'Précision',
    consistency: 'Régularité',
    
    // Historique des matches
    matchHistory: 'Historique des matches',
    opponent: 'Adversaire',
    duration: 'Durée',
    result: 'Résultat',
    win: 'Victoire',
    loss: 'Défaite',
    points: 'Points',
    
    // Activité quotidienne
    dailyActivity: 'Activité quotidienne',
    totalThisWeek: 'Total cette semaine',
    avgPerDay: 'Moyenne par jour',
    bestDay: 'Meilleur jour',
    
    // Boutons d'action profil
    playGame: 'Jouer',
    exportStats: 'Exporter les stats',
    
    // États de l'interface
    loading: 'Chargement',
    current: 'Actuel',
    
    // Boutons de jeu
    playPong: 'Jouer au Pong'
  },
  es: {
    // Navigation
    gameTitle: 'ft_transcendence',
    home: 'Inicio',
    play: 'Jugar',
    profile: 'Perfil',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    logout: 'Cerrar Sesión',
    
    // Messages de navigation
    redirectingToSignIn: 'Redirigiendo al inicio de sesión...',
    redirectingToSignUp: 'Redirigiendo al registro...',
    
    // Page d'accueil
    welcomeTitle: 'Bienvenido a ft_transcendence',
    gameDescription: 'Descubre el clásico juego Pong con un toque de billar',
    feature1Title: 'Jugabilidad Clásica',
    feature1Description: 'Juega contra una IA inteligente',
    feature2Title: 'Multijugador',
    feature2Description: 'Juega contra tus amigos',
    feature3Title: 'Juego Competitivo',
    feature3Description: 'Participa en torneos',
    feature4Title: 'Mi Perfil',
    feature4Description: 'Gestiona tu cuenta',
    
    // Messages pour popup de profil
    accessRestricted: 'Acceso Restringido',
    profileAccessTitle: 'Acceso al Perfil',
    profileLoginRequired: 'Debes estar conectado para acceder a tu perfil y gestionar tus estadísticas de juego.',
    profileStatsFeature: 'Estadísticas de juego',
    profileAchievementsFeature: 'Logros y recompensas',
    profileSettingsFeature: 'Configuración personalizada',
    
    // Boutons d'action
    getStarted: 'Comenzar',
    learnMore: 'Saber más',
    startPlaying: 'Empezar a jugar',
    
    // Authentification
    backToHome: 'Volver al Inicio',
    signInTitle: 'Iniciar Sesión',
    signInSubtitle: 'Bienvenido de vuelta a Pong Billar',
    signUpTitle: 'Registrarse',
    signUpSubtitle: 'Crea tu cuenta de Pong Billar',
    email: 'Email',
    emailPlaceholder: 'Ingresa tu email',
    password: 'Contraseña',
    passwordPlaceholder: 'Ingresa tu contraseña',
    firstName: 'Nombre',
    firstNamePlaceholder: 'Ingresa tu nombre',
    lastName: 'Apellido',
    lastNamePlaceholder: 'Ingresa tu apellido',
    confirmPassword: 'Confirmar Contraseña',
    confirmPasswordPlaceholder: 'Confirma tu contraseña',
    rememberMe: 'Recordarme',
    forgotPassword: '¿Olvidaste tu contraseña?',
    signingIn: 'Iniciando sesión...',
    creatingAccount: 'Creando cuenta...',
    createAccount: 'Crear Cuenta',
    orContinueWith: 'o continuar con',
    googleSignIn: 'Iniciar sesión con Google',
    googleSignUp: 'Registrarse con Google',
    noAccount: '¿No tienes cuenta?',
    alreadyHaveAccount: '¿Ya tienes cuenta?',
    acceptTerms: 'Acepto los',
    termsOfService: 'Términos de Servicio',
    and: 'y la',
    privacyPolicy: 'Política de Privacidad',
    
    // 2FA / Autenticación de dos factores
    twoFactorAuth: 'Autenticación de Dos Factores',
    enter2FACode: 'Por favor ingresa el código de 6 dígitos de tu aplicación de autenticación',
    authCode: 'Código de Autenticación',
    sixDigitCode: '000000',
    verifying: 'Verificando...',
    verify: 'Verificar',
    twoFARequired: 'Autenticación 2FA requerida',
    invalid2FACode: 'Código 2FA inválido',
    twoFAVerificationError: 'Error de verificación 2FA',
    loginSuccessful: '¡Inicio de sesión exitoso!',
    loginProcessingError: 'Error al procesar el inicio de sesión',
    
    // Configuración 2FA
    twoFactorSetup: 'Configuración de Autenticación de Dos Factores',
    twoFactorDescription: 'Agrega una capa adicional de seguridad a tu cuenta',
    enableTwoFactor: 'Habilitar Autenticación de Dos Factores',
    twoFactorBenefit: 'Protege tu cuenta con una capa adicional de seguridad',
    generatingQRCode: 'Generando Código QR...',
    setupInstructions: 'Instrucciones de Configuración',
    downloadAuthApp: 'Descarga una aplicación de autenticación (Google Authenticator, Authy, etc.)',
    scanQRCode: 'Escanea el código QR con tu aplicación de autenticación',
    enterVerificationCode: 'Ingresa el código de verificación a continuación',
    qrCodeAlt: 'Código QR para configuración 2FA',
    cantScanQR: '¿No puedes escanear el código QR?',
    showSecret: 'Mostrar clave de entrada manual',
    hideSecret: 'Ocultar clave de entrada manual',
    copy: 'Copiar',
    copied: '¡Copiado!',
    verifySetup: 'Verificar Configuración',
    enterSixDigitCode: 'Ingresa código de 6 dígitos',
    invalidCode: 'Código de verificación inválido',
    verificationError: 'Error de verificación',
    codeMustBe6Digits: 'El código debe contener exactamente 6 dígitos',
    codeOnlyDigits: 'El código debe contener solo dígitos (0-9)',
    twoFactorEnabled: '¡Autenticación de dos factores habilitada exitosamente!',
    skipForNow: 'Omitir por ahora',
    complete: 'Completar',
    continue: 'Continuar',
    
    // Mensajes de registro
    username: 'Nombre de Usuario',
    signingUp: 'Registrándose...',
    registrationSuccessful: '¡Registro exitoso!',
    registrationError: 'Error de registro',
    allFieldsRequired: 'Todos los campos son requeridos',
    passwordsDoNotMatch: 'Las contraseñas no coinciden',
    passwordTooShort: 'La contraseña debe tener al menos 8 caracteres',
    
    // Messages d'erreur
    invalidCredentials: 'Credenciales inválidas',
    connectionError: 'Error de conexión',
    signupError: 'Error de registro',
    passwordMismatch: 'Las contraseñas no coinciden',
    tooManyAttempts: 'Demasiados intentos. Por favor inténtalo de nuevo más tarde.',
    serverError: 'Error del servidor. Por favor inténtalo de nuevo más tarde.',
    
    // Force du mot de passe
    passwordWeak: 'Débil',
    passwordMedium: 'Medio',
    passwordStrong: 'Fuerte',
    
    // Messages non implémentés
    googleSignInNotImplemented: 'Inicio de sesión con Google no implementado aún',
    googleSignUpNotImplemented: 'Registro con Google no implementado aún',
    forgotPasswordNotImplemented: 'Recuperar contraseña no implementado aún',
    termsNotImplemented: 'Términos no implementados aún',
    privacyNotImplemented: 'Política de privacidad no implementada aún',
    
    // Jeu
    player1: 'Jugador 1',
    player2: 'Jugador 2',
    score: 'Puntuación',
    gameOver: 'Fin del Juego',
    winner: 'Ganador',
    playAgain: 'Jugar de Nuevo',
    pause: 'Pausa',
    resume: 'Reanudar',
    
    // Profil
    profileTitle: 'Perfil',
    statistics: 'Estadísticas',
    gamesPlayed: 'Partidas Jugadas',
    gamesWon: 'Partidas Ganadas',
    winRate: 'Tasa de Victoria',
    bestScore: 'Mejor Puntuación',
    
    // Profil utilisateur détaillé
    changeAvatar: 'Cambiar Avatar',
    rank: 'Rango',
    enterUsername: 'Ingresa nombre de usuario',
    level: 'Nivel',
    pongRating: 'Clasificación Pong',
    status: 'Estado',
    online: 'En línea',
    memberSince: 'Miembro desde',
    title: 'Título',
    saveProfile: 'Guardar perfil',
    
    // Statistiques Pong
    pongStatistics: 'Estadísticas Pong',
    matchesPlayed: 'Partidas jugadas',
    victories: 'Victorias',
    rating: 'Clasificación',
    winRateEvolution: 'Evolución de la tasa de victoria',
    pongSkills: 'Habilidades Pong',
    ballControl: 'Control de pelota',
    defensivePlay: 'Juego defensivo',
    aggressivePlay: 'Juego agresivo',
    reactionTime: 'Tiempo de reacción',
    accuracy: 'Precisión',
    consistency: 'Consistencia',
    
    // Historique des matches
    matchHistory: 'Historial de partidas',
    opponent: 'Oponente',
    duration: 'Duración',
    result: 'Resultado',
    win: 'Victoria',
    loss: 'Derrota',
    points: 'Puntos',
    
    // Activité quotidienne
    dailyActivity: 'Actividad diaria',
    totalThisWeek: 'Total esta semana',
    avgPerDay: 'Promedio por día',
    bestDay: 'Mejor día',
    
    // Boutons d'action profil
    playGame: 'Jugar',
    exportStats: 'Exportar estadísticas',
    
    // États de l'interface
    loading: 'Loading',
    current: 'Current',
    
    // Boutons de jeu
    playPong: 'Play Pong'
  },
  
  it: {
    // Navigation
    gameTitle: 'ft_transcendence',
    home: 'Home',
    play: 'Gioca',
    profile: 'Profilo',
    signIn: 'Accedi',
    signUp: 'Registrati',
    logout: 'Esci',
    
    // Messages de navigation
    redirectingToSignIn: 'Reindirizzamento all\'accesso...',
    redirectingToSignUp: 'Reindirizzamento alla registrazione...',
    
    // Page d'accueil
    welcomeTitle: 'Benvenuto a Pong Biliardo',
    gameDescription: 'Scopri il classico gioco Pong con un tocco di biliardo',
    feature1Title: 'Gameplay Classico',
    feature1Description: 'Gioca contro un\'IA intelligente',
    feature2Title: 'Multigiocatore',
    feature2Description: 'Gioca contro i tuoi amici',
    feature3Title: 'Gioco Competitivo',
    feature3Description: 'Partecipa ai tornei',
    feature4Title: 'Il Mio Profilo',
    feature4Description: 'Gestisci il tuo account',
    
    // Messages pour popup de profil
    accessRestricted: 'Accesso Limitato',
    profileAccessTitle: 'Accesso al Profilo',
    profileLoginRequired: 'Devi essere connesso per accedere al tuo profilo e gestire le tue statistiche di gioco.',
    profileStatsFeature: 'Statistiche di gioco',
    profileAchievementsFeature: 'Successi e ricompense',
    profileSettingsFeature: 'Impostazioni personalizzate',
    
    // Boutons d'action
    getStarted: 'Inizia',
    learnMore: 'Scopri di più',
    startPlaying: 'Inizia a giocare',
    
    // Authentification
    backToHome: 'Torna alla Home',
    signInTitle: 'Accedi',
    signInSubtitle: 'Bentornato a Pong Biliardo',
    signUpTitle: 'Registrati',
    signUpSubtitle: 'Crea il tuo account Pong Biliardo',
    email: 'Email',
    emailPlaceholder: 'Inserisci la tua email',
    password: 'Password',
    passwordPlaceholder: 'Inserisci la tua password',
    firstName: 'Nome',
    firstNamePlaceholder: 'Inserisci il tuo nome',
    lastName: 'Cognome',
    lastNamePlaceholder: 'Inserisci il tuo cognome',
    confirmPassword: 'Conferma Password',
    confirmPasswordPlaceholder: 'Conferma la tua password',
    rememberMe: 'Ricordami',
    forgotPassword: 'Password dimenticata?',
    signingIn: 'Accesso...',
    creatingAccount: 'Creazione account...',
    createAccount: 'Crea Account',
    orContinueWith: 'o continua con',
    googleSignIn: 'Accedi con Google',
    googleSignUp: 'Registrati con Google',
    noAccount: 'Non hai un account?',
    alreadyHaveAccount: 'Hai già un account?',
    acceptTerms: 'Accetto i',
    termsOfService: 'Termini di Servizio',
    and: 'e la',
    privacyPolicy: 'Politica sulla Privacy',
    
    // 2FA / Autenticazione a due fattori
    twoFactorAuth: 'Autenticazione a Due Fattori',
    enter2FACode: 'Per favore inserisci il codice a 6 cifre dalla tua applicazione di autenticazione',
    authCode: 'Codice di Autenticazione',
    sixDigitCode: '000000',
    verifying: 'Verificando...',
    verify: 'Verifica',
    twoFARequired: 'Autenticazione 2FA richiesta',
    invalid2FACode: 'Codice 2FA non valido',
    twoFAVerificationError: 'Errore di verifica 2FA',
    loginSuccessful: 'Accesso riuscito!',
    loginProcessingError: 'Errore nell\'elaborazione dell\'accesso',
    
    // Configurazione 2FA
    twoFactorSetup: 'Configurazione Autenticazione a Due Fattori',
    twoFactorDescription: 'Aggiungi un livello aggiuntivo di sicurezza al tuo account',
    enableTwoFactor: 'Abilita Autenticazione a Due Fattori',
    twoFactorBenefit: 'Proteggi il tuo account con un livello aggiuntivo di sicurezza',
    generatingQRCode: 'Generazione Codice QR...',
    setupInstructions: 'Istruzioni di Configurazione',
    downloadAuthApp: 'Scarica un\'applicazione di autenticazione (Google Authenticator, Authy, ecc.)',
    scanQRCode: 'Scansiona il codice QR con la tua applicazione di autenticazione',
    enterVerificationCode: 'Inserisci il codice di verifica qui sotto',
    qrCodeAlt: 'Codice QR per configurazione 2FA',
    cantScanQR: 'Non riesci a scansionare il codice QR?',
    showSecret: 'Mostra chiave di inserimento manuale',
    hideSecret: 'Nascondi chiave di inserimento manuale',
    copy: 'Copia',
    copied: 'Copiato!',
    verifySetup: 'Verifica Configurazione',
    enterSixDigitCode: 'Inserisci codice a 6 cifre',
    invalidCode: 'Codice di verifica non valido',
    verificationError: 'Errore di verifica',
    codeMustBe6Digits: 'Il codice deve contenere esattamente 6 cifre',
    codeOnlyDigits: 'Il codice deve contenere solo cifre (0-9)',
    twoFactorEnabled: 'Autenticazione a due fattori abilitata con successo!',
    skipForNow: 'Salta per ora',
    complete: 'Completa',
    continue: 'Continua',
    
    // Messaggi di registrazione
    username: 'Nome Utente',
    signingUp: 'Registrando...',
    registrationSuccessful: 'Registrazione riuscita!',
    registrationError: 'Errore di registrazione',
    allFieldsRequired: 'Tutti i campi sono obbligatori',
    passwordsDoNotMatch: 'Le password non corrispondono',
    passwordTooShort: 'La password deve contenere almeno 8 caratteri',
    
    // Messages d'erreur
    invalidCredentials: 'Credenziali non valide',
    connectionError: 'Errore di connessione',
    signupError: 'Errore di registrazione',
    passwordMismatch: 'Le password non corrispondono',
    tooManyAttempts: 'Troppi tentativi. Per favore riprova più tardi.',
    serverError: 'Errore del server. Per favore riprova più tardi.',
    
    // Force du mot de passe
    passwordWeak: 'Debole',
    passwordMedium: 'Media',
    passwordStrong: 'Forte',
    
    // Messages non implémentés
    googleSignInNotImplemented: 'Accesso Google non ancora implementato',
    googleSignUpNotImplemented: 'Registrazione Google non ancora implementata',
    forgotPasswordNotImplemented: 'Password dimenticata non ancora implementata',
    termsNotImplemented: 'Termini non ancora implementati',
    privacyNotImplemented: 'Politica sulla privacy non ancora implementata',
    
    // Jeu
    player1: 'Giocatore 1',
    player2: 'Giocatore 2',
    score: 'Punteggio',
    gameOver: 'Fine Partita',
    winner: 'Vincitore',
    playAgain: 'Gioca Ancora',
    pause: 'Pausa',
    resume: 'Riprendi',
    
    // Profil
    profileTitle: 'Profilo',
    statistics: 'Statistiche',
    gamesPlayed: 'Partite Giocate',
    gamesWon: 'Partite Vinte',
    winRate: 'Tasso di Vittoria',
    bestScore: 'Miglior Punteggio',
    
    // Profil utilisateur détaillé
    changeAvatar: 'Cambia Avatar',
    rank: 'Rango',
    enterUsername: 'Inserisci nome utente',
    level: 'Livello',
    pongRating: 'Classificazione Pong',
    status: 'Stato',
    online: 'Online',
    memberSince: 'Membro dal',
    title: 'Titolo',
    saveProfile: 'Salva profilo',
    
    // Statistiques Pong
    pongStatistics: 'Statistiche Pong',
    matchesPlayed: 'Partite giocate',
    victories: 'Vittorie',
    rating: 'Classificazione',
    winRateEvolution: 'Evoluzione del tasso di vittoria',
    pongSkills: 'Abilità Pong',
    ballControl: 'Controllo palla',
    defensivePlay: 'Gioco difensivo',
    aggressivePlay: 'Gioco aggressivo',
    reactionTime: 'Tempo di reazione',
    accuracy: 'Precisione',
    consistency: 'Coerenza',
    
    // Historique des matches
    matchHistory: 'Cronologia partite',
    opponent: 'Avversario',
    duration: 'Durata',
    result: 'Risultato',
    win: 'Vittoria',
    loss: 'Sconfitta',
    points: 'Punti',
    
    // Activité quotidienne
    dailyActivity: 'Attività giornaliera',
    totalThisWeek: 'Totale questa settimana',
    avgPerDay: 'Media al giorno',
    bestDay: 'Miglior giornata',
    
    // Boutons d'action profil
    playGame: 'Gioca',
    exportStats: 'Esporta statistiche',
    
    // États de l'interface
    loading: 'Loading',
    current: 'Current',
    
    // Boutons de jeu
    playPong: 'Play Pong'
  }
}

const i18n = createI18n({
  locale: 'fr', // langue par défaut
  fallbackLocale: 'en',
  messages
})

export default i18n