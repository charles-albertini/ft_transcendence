<template>
  <!-- Popup pour l'édition du profil -->
  <div v-if="show" class="modal-overlay" @click="close">

    <div class="edit-profile-modal" @click.stop>
      <button @click="close" class="modal-close">×</button>
      
      <div class="modal-header">
        <h2 class="modal-title">
          {{ $t('editProfile') || 'Modifier le profil' }}
        </h2>
      </div>
      
      <div class="edit-form">
        <!-- Modification de l'avatar -->
        <div class="edit-row">
          <label class="edit-label">{{ $t('avatar') || 'Avatar' }}:</label>
          <div class="edit-input-group">
            <div class="avatar-selection">
              <div class="current-avatar">
                <img :src="editableProfile.avatar || DEFAULT_AVATAR" alt="Avatar actuel" class="mini-avatar" />
                <span>{{ isCustomAvatar ? 'Avatar personnalisé' : 'Avatar par défaut' }}</span>
              </div>
              
              <!-- Upload de fichier personnalisé -->
              <div class="avatar-upload">
                <label for="avatar-file" class="upload-button">
                  📁 {{ isCustomAvatar ? 'Changer l\'avatar' : 'Télécharger une image' }}
                </label>
                <input 
                  id="avatar-file" 
                  type="file" 
                  accept="image/*" 
                  @change="handleAvatarUpload"
                  class="file-input"
                  :disabled="isUpdating"
                />
                <span class="upload-hint">PNG, JPG jusqu'à 2MB</span>
              </div>
              
              <!-- Bouton pour revenir à l'avatar par défaut (seulement si avatar personnalisé) -->
              <div v-if="isCustomAvatar" class="avatar-reset">
                <button 
                  @click="resetToDefaultAvatar"
                  class="reset-avatar-button"
                  :disabled="isUpdating"
                >
                  ↻ Revenir à l'avatar par défaut
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modification du nom d'utilisateur -->
        <div class="edit-row">
          <label class="edit-label">{{ $t('username') }}:</label>
          <div class="edit-input-group">
            <input 
              v-model="editableProfile.username" 
              type="text" 
              class="edit-input"
              :placeholder="$t('enterUsername')"
              :disabled="isUpdating"
              maxlength="20"
            />
            <span class="input-hint">Max 20 caractères</span>
          </div>
        </div>

        <!-- Changement de mot de passe -->
        <div class="edit-row">
          <label class="edit-label">{{ $t('password') || 'Mot de passe' }}:</label>
          <div class="edit-input-group">
            <div class="password-section">
              <div class="password-fields">
                <div class="password-input-container">
                  <input 
                    v-model="passwordChange.current" 
                    :type="showPasswords.current ? 'text' : 'password'"
                    class="edit-input"
                    placeholder="Mot de passe actuel"
                    :disabled="isUpdating"
                  />
                  <button 
                    type="button" 
                    @click="togglePasswordVisibility('current')" 
                    class="password-toggle"
                    :disabled="isUpdating"
                  >
                    <svg v-if="showPasswords.current" class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                    </svg>
                    <svg v-else class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
                
                <div class="password-input-container">
                  <input 
                    v-model="passwordChange.new" 
                    :type="showPasswords.new ? 'text' : 'password'"
                    class="edit-input"
                    placeholder="Nouveau mot de passe"
                    :disabled="isUpdating"
                  />
                  <button 
                    type="button" 
                    @click="togglePasswordVisibility('new')" 
                    class="password-toggle"
                    :disabled="isUpdating"
                  >
                    <svg v-if="showPasswords.new" class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                    </svg>
                    <svg v-else class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
                
                <div class="password-input-container">
                  <input 
                    v-model="passwordChange.confirm" 
                    :type="showPasswords.confirm ? 'text' : 'password'"
                    class="edit-input"
                    placeholder="Confirmer le nouveau mot de passe"
                    :disabled="isUpdating"
                  />
                  <button 
                    type="button" 
                    @click="togglePasswordVisibility('confirm')" 
                    class="password-toggle"
                    :disabled="isUpdating"
                  >
                    <svg v-if="showPasswords.confirm" class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                    </svg>
                    <svg v-else class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <button 
                @click="changePassword"
                :disabled="isUpdating || !canChangePassword"
                class="password-change-button"
              >
                🔑 Changer le mot de passe
              </button>
              
              <span class="input-hint">
                Laissez vide si vous ne voulez pas changer votre mot de passe
              </span>
            </div>
          </div>
        </div>

        <!-- Gestion de la 2FA -->
        <div class="edit-row">
          <label class="edit-label">{{ $t('twoFA') || 'Authentification à deux facteurs' }}:</label>
          <div class="edit-input-group">
            <div class="twofa-section">
              <div class="twofa-status">
                <span class="twofa-indicator" :class="{ 'active': editableProfile.twoFA }">
                  {{ editableProfile.twoFA ? '🔒 Activée' : '🔓 Désactivée' }}
                </span>
                <span class="twofa-description">
                  {{ editableProfile.twoFA ? 'Votre compte est sécurisé' : 'Renforcez la sécurité de votre compte' }}
                </span>
              </div>
              
              <!-- QR Code pour l'activation de la 2FA -->
              <div v-if="showQRCode && qrCodeData" class="qr-code-section">
                <h4 class="qr-title">📱 Scannez ce QR code avec votre app d'authentification</h4>
                <div class="qr-code-container">
                  <img :src="qrCodeData" alt="QR Code 2FA" class="qr-code-image" />
                </div>
                <div class="qr-instructions">
                  <p><strong>Instructions :</strong></p>
                  <ol>
                    <li>Ouvrez votre app d'authentification (Google Authenticator, Authy, etc.)</li>
                    <li>Scannez ce QR code</li>
                    <li>Entrez le code à 6 chiffres généré par l'app</li>
                  </ol>
                </div>
                
                <!-- Champ de vérification -->
                <div class="verification-section">
                  <input 
                    v-model="verificationCode"
                    type="text" 
                    class="edit-input verification-input"
                    placeholder="Code à 6 chiffres"
                    maxlength="6"
                    :disabled="isUpdating"
                  />
                  <div class="verification-buttons">
                    <button 
                      @click="verify2FASetup"
                      :disabled="isUpdating || verificationCode.length !== 6"
                      class="verify-button"
                    >
                      ✅ Vérifier et activer
                    </button>
                    <button 
                      @click="cancel2FASetup"
                      :disabled="isUpdating"
                      class="cancel-button"
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Bouton pour activer/désactiver la 2FA -->
              <button 
                v-if="shouldShow2FAButton"
                @click="toggle2FA"
                :disabled="isUpdating"
                class="twofa-toggle-button"
                :class="{ 'active': editableProfile.twoFA }"
              >
                {{ editableProfile.twoFA ? '🔓 Désactiver la 2FA' : '🔒 Activer la 2FA' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="edit-actions">
          <button 
            @click="saveProfile" 
            :disabled="isUpdating || !hasChanges"
            class="btn-save"
          >
            <span v-if="isUpdating">
              <div class="spinner"></div>
              {{ $t('saving') || 'Sauvegarde...' }}
            </span>
            <span v-else>
              💾 {{ $t('saveChanges') || 'Sauvegarder' }}
            </span>
          </button>
        </div>

        <!-- Messages de feedback -->
        <div v-if="updateMessage" class="update-message" :class="updateMessage.type">
          {{ updateMessage.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { userApi } from '../services/userAPI.ts'
import { TwoFactorService } from '../services/twoFactorAPI.ts'
import { DEFAULT_AVATARS_BASE64, resizeImageToBase64, isValidImageBase64, getBase64Size } from '../utils/imageUtils.ts'

const { t } = useI18n()

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  userProfile: {
    type: Object,
    required: true
  }
})

// Debug: surveiller les changements de la prop show
watch(() => props.show, (newValue, oldValue) => {
  console.log('EditProfileModal - prop show changed:', { oldValue, newValue })
}, { immediate: true })

// Émissions
const emit = defineEmits(['close', 'profile-updated'])

// Variables pour l'édition du profil
const editableProfile = ref({
  username: '',
  twoFA: false,
  avatar: null
})

const originalProfile = ref({})
const isUpdating = ref(false)
const updateMessage = ref(null)

// Variables pour le changement de mot de passe
const passwordChange = ref({
  current: '',
  new: '',
  confirm: ''
})

const showPasswords = ref({
  current: false,
  new: false,
  confirm: false
})

// Variables pour la 2FA
const twoFactorService = TwoFactorService.getInstance()
const qrCodeData = ref(null)
const twoFASecret = ref('')
const showQRCode = ref(false)
const verificationCode = ref('')
const is2FABeingSetup = ref(false)

// Constantes
const DEFAULT_AVATAR = DEFAULT_AVATARS_BASE64.default

// Computed
const hasChanges = computed(() => {
  return editableProfile.value.username !== originalProfile.value.username ||
         editableProfile.value.twoFA !== originalProfile.value.twoFA ||
         editableProfile.value.avatar !== originalProfile.value.avatar
})

const canChangePassword = computed(() => {
  return passwordChange.value.current && 
         passwordChange.value.new && 
         passwordChange.value.confirm &&
         passwordChange.value.new === passwordChange.value.confirm &&
         passwordChange.value.new.length >= 6
})

const shouldShow2FAButton = computed(() => {
  return !showQRCode.value
})

const isCustomAvatar = computed(() => {
  const currentAvatar = editableProfile.value.avatar
  return currentAvatar && 
         currentAvatar !== DEFAULT_AVATAR && 
         !Object.values(DEFAULT_AVATARS_BASE64).includes(currentAvatar)
})

// Watchers
watch(() => props.show, (newValue) => {
  if (newValue) {
    initializeEditableProfile()
    reset2FAState()
  }
})

watch(() => props.userProfile, (newProfile) => {
  if (newProfile && props.show) {
    initializeEditableProfile()
  }
}, { deep: true })

// Méthodes
const initializeEditableProfile = () => {
  editableProfile.value = {
    username: props.userProfile?.username || '',
    twoFA: props.userProfile?.twoFA || false,
    avatar: props.userProfile?.avatar || DEFAULT_AVATAR
  }
  originalProfile.value = { ...editableProfile.value }
}

const close = () => {
  emit('close')
  reset2FAState()
}

const reset2FAState = () => {
  showQRCode.value = false
  qrCodeData.value = null
  twoFASecret.value = ''
  verificationCode.value = ''
  is2FABeingSetup.value = false
}

const togglePasswordVisibility = (field) => {
  showPasswords.value[field] = !showPasswords.value[field]
}

const toggle2FA = async () => {
  try {
    isUpdating.value = true
    updateMessage.value = null
    
    if (!editableProfile.value.twoFA) {
      // Activation de la 2FA - générer le QR code
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Token d\'authentification non trouvé')
      }
      
      is2FABeingSetup.value = true
      const response = await twoFactorService.enable2FA(token)
      
      qrCodeData.value = response.qrCode
      twoFASecret.value = response.secret
      showQRCode.value = true
      
      updateMessage.value = {
        type: 'info',
        text: 'Scannez le QR code avec votre app d\'authentification'
      }
    } else {
      // Désactivation de la 2FA
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Token d\'authentification non trouvé')
      }
      
      const response = await twoFactorService.disable2FA(token)
      
      if (response.success) {
        editableProfile.value.twoFA = false
        originalProfile.value.twoFA = false
        
        // Réinitialiser les variables 2FA
        reset2FAState()
        
        updateMessage.value = {
          type: 'success',
          text: '2FA désactivée avec succès !'
        }
      } else {
        throw new Error(response.message || 'Erreur lors de la désactivation de la 2FA')
      }
    }
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      updateMessage.value = null
    }, 3000)
    
  } catch (error) {
    updateMessage.value = {
      type: 'error',
      text: error.message || 'Erreur lors de la modification de la 2FA'
    }
    
    // Effacer le message d'erreur après 5 secondes
    setTimeout(() => {
      updateMessage.value = null
    }, 5000)
  } finally {
    isUpdating.value = false
  }
}

const verify2FASetup = async () => {
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    updateMessage.value = {
      type: 'error',
      text: 'Veuillez entrer un code à 6 chiffres'
    }
    return
  }
  
  try {
    isUpdating.value = true
    updateMessage.value = null
    
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || localStorage.getItem('accessToken')
    if (!token) {
      throw new Error('Token d\'authentification non trouvé')
    }
    
    const response = await twoFactorService.verify2FA(token, verificationCode.value)
    
    if (response.success) {
      // Activer la 2FA dans le profil
      editableProfile.value.twoFA = true
      originalProfile.value.twoFA = true
      
      // Réinitialiser l'interface de configuration
      reset2FAState()
      
      updateMessage.value = {
        type: 'success',
        text: '2FA activée avec succès ! Votre compte est maintenant sécurisé.'
      }
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        updateMessage.value = null
      }, 3000)
    } else {
      throw new Error(response.message || 'Code de vérification invalide')
    }
    
  } catch (error) {
    updateMessage.value = {
      type: 'error',
      text: error.message || 'Erreur lors de la vérification du code'
    }
    
    // Effacer le message d'erreur après 5 secondes
    setTimeout(() => {
      updateMessage.value = null
    }, 5000)
  } finally {
    isUpdating.value = false
  }
}

const cancel2FASetup = () => {
  // Réinitialiser toutes les variables de configuration 2FA
  reset2FAState()
  
  updateMessage.value = {
    type: 'info',
    text: 'Configuration 2FA annulée'
  }
  
  // Effacer le message après 2 secondes
  setTimeout(() => {
    updateMessage.value = null
  }, 2000)
}

const changePassword = async () => {
  if (!canChangePassword.value) return
  
  try {
    isUpdating.value = true
    updateMessage.value = null
    
    // Validation côté client
    if (passwordChange.value.new !== passwordChange.value.confirm) {
      throw new Error('Les nouveaux mots de passe ne correspondent pas')
    }
    
    if (passwordChange.value.new.length < 6) {
      throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères')
    }
    
    // Appel API pour changer le mot de passe
    const response = await userApi.changePassword({
      currentPassword: passwordChange.value.current,
      newPassword: passwordChange.value.new
    })
    
    
    // Réinitialiser les champs de mot de passe
    passwordChange.value = {
      current: '',
      new: '',
      confirm: ''
    }
    
    updateMessage.value = {
      type: 'success',
      text: 'Mot de passe changé avec succès !'
    }
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      updateMessage.value = null
    }, 3000)
    
  } catch (error) {
    updateMessage.value = {
      type: 'error',
      text: error.message || 'Erreur lors du changement de mot de passe'
    }
    
    // Effacer le message d'erreur après 5 secondes
    setTimeout(() => {
      updateMessage.value = null
    }, 5000)
  } finally {
    isUpdating.value = false
  }
}

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      updateMessage.value = {
        type: 'error',
        text: 'Veuillez sélectionner un fichier image valide (PNG, JPG, etc.)'
      }
      return
    }
    
    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      updateMessage.value = {
        type: 'error',
        text: 'Le fichier image ne doit pas dépasser 2MB'
      }
      return
    }
    
    // Convertir et redimensionner l'image
    const base64Image = await resizeImageToBase64(file, 150, 150, 0.8)
    
    // Validation de l'image convertie
    if (!isValidImageBase64(base64Image)) {
      throw new Error('Format d\'image non valide après conversion')
    }
    
    // Vérifier la taille finale
    const finalSize = getBase64Size(base64Image)
    if (finalSize > 2 * 1024 * 1024) {
      throw new Error('L\'image redimensionnée est toujours trop volumineuse')
    }
    
    editableProfile.value.avatar = base64Image
    
    updateMessage.value = {
      type: 'success',
      text: 'Avatar téléchargé avec succès'
    }
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      updateMessage.value = null
    }, 3000)
    
  } catch (error) {
    updateMessage.value = {
      type: 'error',
      text: error.message || 'Erreur lors du téléchargement de l\'avatar'
    }
    
    // Effacer le message d'erreur après 5 secondes
    setTimeout(() => {
      updateMessage.value = null
    }, 5000)
  } finally {
    // Réinitialiser l'input file
    event.target.value = ''
  }
}

const resetToDefaultAvatar = () => {
  editableProfile.value.avatar = DEFAULT_AVATAR
  updateMessage.value = {
    type: 'success',
    text: 'Avatar remis par défaut'
  }
  
  // Effacer le message après 3 secondes
  setTimeout(() => {
    updateMessage.value = null
  }, 3000)
}

const saveProfile = async () => {
  if (!hasChanges.value) return
  
  isUpdating.value = true
  updateMessage.value = null
  
  try {
    // Validation côté client
    if (!editableProfile.value.username.trim()) {
      throw new Error('Le nom d\'utilisateur ne peut pas être vide')
    }
    
    if (editableProfile.value.username.length > 20) {
      throw new Error('Le nom d\'utilisateur ne peut pas dépasser 20 caractères')
    }
    
    // Appel API pour mettre à jour le profil
    const updateData = {
      username: editableProfile.value.username.trim(),
      twoFA: editableProfile.value.twoFA,
      avatar: editableProfile.value.avatar
    }
    
    const response = await userApi.updateUser(updateData)
    
    // Mettre à jour les données originales
    originalProfile.value = { ...editableProfile.value }
    
    updateMessage.value = {
      type: 'success',
      text: 'Profil mis à jour avec succès !'
    }
    
    // Émettre l'événement de mise à jour
    emit('profile-updated', editableProfile.value)
    
    // Fermer la popup après une sauvegarde réussie
    setTimeout(() => {
      close()
    }, 1500)
    
  } catch (error) {
    updateMessage.value = {
      type: 'error',
      text: error.message || 'Erreur lors de la mise à jour du profil'
    }
    
    // Effacer le message d'erreur après 5 secondes
    setTimeout(() => {
      updateMessage.value = null
    }, 5000)
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.edit-profile-modal {
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  border: 2px solid #d4af37;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 550px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  color: #f8f9fa;
  backdrop-filter: blur(10px);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(239, 68, 68, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.modal-close:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  color: #d4af37;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.modal-header {
  margin-bottom: 1.5rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.edit-row {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.edit-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e0e0e0;
}

.edit-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-input {
  padding: 0.75rem;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  transition: all 0.2s ease-in-out;
}

.edit-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
  background-color: rgba(255, 255, 255, 0.15);
}

.edit-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-hint {
  font-size: 0.8em;
  color: #e0e0e0;
  opacity: 0.8;
}

/* Styles pour la section 2FA */
.twofa-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.twofa-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.twofa-indicator {
  font-size: 1.1em;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  text-align: center;
}

.twofa-indicator.active {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.3);
}

.twofa-description {
  font-size: 0.9em;
  color: #e0e0e0;
  opacity: 0.8;
  text-align: center;
}

.twofa-toggle-button {
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85em;
  margin-top: 0.5rem;
}

.twofa-toggle-button:not(.active) {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.twofa-toggle-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

.twofa-toggle-button:not(.active):hover:not(:disabled) {
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.twofa-toggle-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Styles pour la section changement de mot de passe */
.password-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.password-fields {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-toggle {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: #d4af37;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 1.2em;
}

.password-toggle:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.2);
  color: #f4d03f;
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.eye-icon {
  width: 20px;
  height: 20px;
}

.password-change-button {
  padding: 0.6rem 0.8rem;
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a1a1a;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.password-change-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #c19b2e, #b8941f);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.password-change-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Styles pour la section avatar */
.avatar-selection {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.current-avatar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.mini-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #d4af37;
  object-fit: cover;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-button {
  display: inline-block;
  padding: 0.6rem 0.8rem;
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a1a1a;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.upload-button:hover {
  background: linear-gradient(135deg, #c19b2e, #b8941f);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.file-input {
  display: none;
}

.upload-hint {
  font-size: 0.8em;
  color: #e0e0e0;
  opacity: 0.8;
}

.avatar-reset {
  display: flex;
  justify-content: center;
}

.reset-avatar-button {
  padding: 0.5rem 1rem;
  background: transparent;
  color: #f59e0b;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reset-avatar-button:hover:not(:disabled) {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  border-color: #fbbf24;
  transform: translateY(-1px);
}

.reset-avatar-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Styles pour les boutons d'action */
.edit-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  margin-top: 0.8rem;
}

.btn-save {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a1a1a;
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #c19b2e, #b8941f);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Messages de feedback */
.update-message {
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem;
}

.update-message.success {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.update-message.error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.update-message.info {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* Styles pour la section QR code */
.qr-code-section {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  margin: 0.8rem 0;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.qr-title {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.8rem;
}

.qr-code-container {
  display: flex;
  justify-content: center;
  margin-bottom: 0.8rem;
}

.qr-code-image {
  max-width: 180px;
  height: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  padding: 0.5rem;
}

.qr-instructions {
  color: #475569;
  margin-bottom: 1rem;
}

.qr-instructions ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.qr-instructions li {
  margin-bottom: 0.3rem;
}

.verification-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.verification-input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.1rem;
  text-align: center;
  font-family: monospace;
  letter-spacing: 0.2em;
}

.verification-input:focus {
  border-color: #3b82f6;
  outline: none;
}

.verification-buttons {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
}

.verify-button {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.85em;
}

.verify-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.verify-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

.cancel-button {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.85em;
}

.cancel-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .edit-profile-modal {
    padding: 1.5rem;
    max-height: 95vh;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}
</style>
