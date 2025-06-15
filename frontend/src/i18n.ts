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
    
    // Messages d'erreur
    invalidCredentials: 'Invalid credentials',
    connectionError: 'Connection error',
    signupError: 'Signup error',
    passwordMismatch: 'Passwords do not match',
    
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
    bestScore: 'Best Score'
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
    bestScore: 'Meilleur score'
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
    
    // Messages d'erreur
    invalidCredentials: 'Credenciales inválidas',
    connectionError: 'Error de conexión',
    signupError: 'Error de registro',
    passwordMismatch: 'Las contraseñas no coinciden',
    
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
    bestScore: 'Mejor Puntuación'
  },
  de: {
    // Navigation
    gameTitle: 'Billard Pong',
    home: 'Startseite',
    play: 'Spielen',
    profile: 'Profil',
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    logout: 'Abmelden',
    
    // Messages de navigation
    redirectingToSignIn: 'Weiterleitung zur Anmeldung...',
    redirectingToSignUp: 'Weiterleitung zur Registrierung...',
    
    // Page d'accueil
    welcomeTitle: 'Willkommen bei Billard Pong',
    gameDescription: 'Entdecken Sie das klassische Pong-Spiel mit einem Billard-Touch',
    feature1Title: 'Klassisches Gameplay',
    feature1Description: 'Spielen Sie gegen intelligente KI',
    feature2Title: 'Mehrspieler',
    feature2Description: 'Spielen Sie gegen Ihre Freunde',
    feature3Title: 'Wettkampfspiel',
    feature3Description: 'Nehmen Sie an Turnieren teil',
    
    // Boutons d'action
    getStarted: 'Loslegen',
    learnMore: 'Mehr erfahren',
    startPlaying: 'Spielen beginnen',
    
    // Authentification
    backToHome: 'Zurück zur Startseite',
    signInTitle: 'Anmelden',
    signInSubtitle: 'Willkommen zurück bei Billard Pong',
    signUpTitle: 'Registrieren',
    signUpSubtitle: 'Erstellen Sie Ihr Billard Pong Konto',
    email: 'E-Mail',
    emailPlaceholder: 'Geben Sie Ihre E-Mail ein',
    password: 'Passwort',
    passwordPlaceholder: 'Geben Sie Ihr Passwort ein',
    firstName: 'Vorname',
    firstNamePlaceholder: 'Geben Sie Ihren Vornamen ein',
    lastName: 'Nachname',
    lastNamePlaceholder: 'Geben Sie Ihren Nachnamen ein',
    confirmPassword: 'Passwort bestätigen',
    confirmPasswordPlaceholder: 'Bestätigen Sie Ihr Passwort',
    rememberMe: 'Angemeldet bleiben',
    forgotPassword: 'Passwort vergessen?',
    signingIn: 'Anmeldung...',
    creatingAccount: 'Konto erstellen...',
    createAccount: 'Konto erstellen',
    orContinueWith: 'oder fortfahren mit',
    googleSignIn: 'Mit Google anmelden',
    googleSignUp: 'Mit Google registrieren',
    noAccount: 'Kein Konto?',
    alreadyHaveAccount: 'Bereits ein Konto?',
    acceptTerms: 'Ich akzeptiere die',
    termsOfService: 'Nutzungsbedingungen',
    and: 'und die',
    privacyPolicy: 'Datenschutzrichtlinie',
    
    // Messages d'erreur
    invalidCredentials: 'Ungültige Anmeldedaten',
    connectionError: 'Verbindungsfehler',
    signupError: 'Registrierungsfehler',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    
    // Force du mot de passe
    passwordWeak: 'Schwach',
    passwordMedium: 'Mittel',
    passwordStrong: 'Stark',
    
    // Messages non implémentés
    googleSignInNotImplemented: 'Google-Anmeldung noch nicht implementiert',
    googleSignUpNotImplemented: 'Google-Registrierung noch nicht implementiert',
    forgotPasswordNotImplemented: 'Passwort vergessen noch nicht implementiert',
    termsNotImplemented: 'Bedingungen noch nicht implementiert',
    privacyNotImplemented: 'Datenschutzrichtlinie noch nicht implementiert',
    
    // Jeu
    player1: 'Spieler 1',
    player2: 'Spieler 2',
    score: 'Punktzahl',
    gameOver: 'Spiel beendet',
    winner: 'Gewinner',
    playAgain: 'Nochmal spielen',
    pause: 'Pause',
    resume: 'Fortsetzen',
    
    // Profil
    profileTitle: 'Profil',
    statistics: 'Statistiken',
    gamesPlayed: 'Gespielte Spiele',
    gamesWon: 'Gewonnene Spiele',
    winRate: 'Gewinnrate',
    bestScore: 'Beste Punktzahl'
  },
  it: {
    // Navigation
    gameTitle: 'Pong Biliardo',
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
    
    // Messages d'erreur
    invalidCredentials: 'Credenziali non valide',
    connectionError: 'Errore di connessione',
    signupError: 'Errore di registrazione',
    passwordMismatch: 'Le password non corrispondono',
    
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
    bestScore: 'Miglior Punteggio'
  },
  pt: {
    // Navigation
    gameTitle: 'Pong Bilhar',
    home: 'Início',
    play: 'Jogar',
    profile: 'Perfil',
    signIn: 'Entrar',
    signUp: 'Cadastrar',
    logout: 'Sair',
    
    // Messages de navigation
    redirectingToSignIn: 'Redirecionando para o login...',
    redirectingToSignUp: 'Redirecionando para o cadastro...',
    
    // Page d'accueil
    welcomeTitle: 'Bem-vindo ao Pong Bilhar',
    gameDescription: 'Descubra o clássico jogo Pong com um toque de bilhar',
    feature1Title: 'Gameplay Clássico',
    feature1Description: 'Jogue contra uma IA inteligente',
    feature2Title: 'Multijogador',
    feature2Description: 'Jogue contra seus amigos',
    feature3Title: 'Jogo Competitivo',
    feature3Description: 'Participe de torneios',
    
    // Boutons d'action
    getStarted: 'Começar',
    learnMore: 'Saiba mais',
    startPlaying: 'Começar a jogar',
    
    // Authentification
    backToHome: 'Voltar ao Início',
    signInTitle: 'Entrar',
    signInSubtitle: 'Bem-vindo de volta ao Pong Bilhar',
    signUpTitle: 'Cadastrar',
    signUpSubtitle: 'Crie sua conta Pong Bilhar',
    email: 'Email',
    emailPlaceholder: 'Digite seu email',
    password: 'Senha',
    passwordPlaceholder: 'Digite sua senha',
    firstName: 'Nome',
    firstNamePlaceholder: 'Digite seu nome',
    lastName: 'Sobrenome',
    lastNamePlaceholder: 'Digite seu sobrenome',
    confirmPassword: 'Confirmar Senha',
    confirmPasswordPlaceholder: 'Confirme sua senha',
    rememberMe: 'Lembrar de mim',
    forgotPassword: 'Esqueceu a senha?',
    signingIn: 'Entrando...',
    creatingAccount: 'Criando conta...',
    createAccount: 'Criar Conta',
    orContinueWith: 'ou continue com',
    googleSignIn: 'Entrar com Google',
    googleSignUp: 'Cadastrar com Google',
    noAccount: 'Não tem conta?',
    alreadyHaveAccount: 'Já tem conta?',
    acceptTerms: 'Aceito os',
    termsOfService: 'Termos de Serviço',
    and: 'e a',
    privacyPolicy: 'Política de Privacidade',
    
    // Messages d'erreur
    invalidCredentials: 'Credenciais inválidas',
    connectionError: 'Erro de conexão',
    signupError: 'Erro de cadastro',
    passwordMismatch: 'As senhas não coincidem',
    
    // Force du mot de passe
    passwordWeak: 'Fraca',
    passwordMedium: 'Média',
    passwordStrong: 'Forte',
    
    // Messages non implémentés
    googleSignInNotImplemented: 'Login com Google ainda não implementado',
    googleSignUpNotImplemented: 'Cadastro com Google ainda não implementado',
    forgotPasswordNotImplemented: 'Esqueci a senha ainda não implementado',
    termsNotImplemented: 'Termos ainda não implementados',
    privacyNotImplemented: 'Política de privacidade ainda não implementada',
    
    // Jeu
    player1: 'Jogador 1',
    player2: 'Jogador 2',
    score: 'Pontuação',
    gameOver: 'Fim de Jogo',
    winner: 'Vencedor',
    playAgain: 'Jogar Novamente',
    pause: 'Pausar',
    resume: 'Continuar',
    
    // Profil
    profileTitle: 'Perfil',
    statistics: 'Estatísticas',
    gamesPlayed: 'Jogos Jogados',
    gamesWon: 'Jogos Ganhos',
    winRate: 'Taxa de Vitória',
    bestScore: 'Melhor Pontuação'
  }
}

const i18n = createI18n({
  locale: 'fr', // langue par défaut
  fallbackLocale: 'en',
  messages
})

export default i18n