import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useSettingsStore = defineStore('settings', () => {
  const storeName = ref('')
  const storeLogo = ref('')
  const primaryColor = ref('')
  const secondaryColor = ref('')

  // Fetch public settings
  const fetchPublicSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings/public')
      if (response.data.success) {
        storeName.value = response.data.data.storeName || ''
        storeLogo.value = response.data.data.storeLogo || ''
        primaryColor.value = response.data.data.primaryColor || ''
        secondaryColor.value = response.data.data.secondaryColor || ''
      }
    } catch (error) {
      console.error('Error fetching public settings:', error)
    }
  }

  // Update settings (call after admin saves)
  const updateSettings = (settings) => {
    if (settings.storeName !== undefined) storeName.value = settings.storeName
    if (settings.storeLogo !== undefined) storeLogo.value = settings.storeLogo
    if (settings.primaryColor !== undefined) primaryColor.value = settings.primaryColor
    if (settings.secondaryColor !== undefined) secondaryColor.value = settings.secondaryColor
  }

  return {
    storeName,
    storeLogo,
    primaryColor,
    secondaryColor,
    fetchPublicSettings,
    updateSettings,
  }
})
