document.addEventListener("DOMContentLoaded", () => {
  // Бронирование столика
  const bookTableBtn = document.getElementById("bookTableBtn")
  const bookingModal = document.getElementById("bookingModal")
  const closeBtn = document.querySelector(".close")
  const bookingForm = document.getElementById("bookingForm")

  if (bookTableBtn && bookingModal) {
    // Открытие модального окна
    bookTableBtn.addEventListener("click", (e) => {
      e.preventDefault()
      bookingModal.style.display = "block"
    })

    // Закрытие модального окна
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        bookingModal.style.display = "none"
        resetForm()
      })
    }

    // Закрытие при клике вне окна
    window.addEventListener("click", (e) => {
      if (e.target === bookingModal) {
        bookingModal.style.display = "none"
        resetForm()
      }
    })
  }

  // Валидация формы
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault()

      let isValid = true

      // Проверка имени
      if (!document.getElementById("name").value.trim()) {
        document.getElementById("nameError").style.display = "block"
        isValid = false
      } else {
        document.getElementById("nameError").style.display = "none"
      }

      // Проверка телефона
      if (!document.getElementById("phone").value.trim()) {
        document.getElementById("phoneError").style.display = "block"
        isValid = false
      } else {
        document.getElementById("phoneError").style.display = "none"
      }

      // Проверка согласия
      if (!document.getElementById("consent").checked) {
        document.getElementById("consentError").style.display = "block"
        isValid = false
      } else {
        document.getElementById("consentError").style.display = "none"
      }

      if (isValid) {
        alert("Ваш столик успешно забронирован! Мы скоро с вами свяжемся.")
        bookingModal.style.display = "none"
        resetForm()
      }
    })
  }

  // Валидация даты и времени
  const dateInput = document.querySelector('input[type="date"]')
  const timeInput = document.querySelector('input[type="time"]')

  function parseDateString(val) {
    if (!val) return null
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return new Date(val + "T00:00:00")
    }
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(val)) {
      const [d, m, y] = val.split(".").map(Number)
      return new Date(y, m - 1, d)
    }
    const d = new Date(val)
    return isNaN(d.getTime()) ? null : d
  }

  function todayAtZero() {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  }

  if (dateInput && dateInput.type === "date") {
    const today = todayAtZero()
    const iso = today.toISOString().slice(0, 10)
    dateInput.setAttribute("min", iso)
  }

  if (timeInput && timeInput.type === "time") {
    timeInput.setAttribute("min", "12:00")
  }

  function validateDateField() {
    if (!dateInput) return { ok: true }
    const raw = dateInput.value
    const parsed = parseDateString(raw)
    if (!parsed) return { ok: false, reason: "Неверный формат даты." }

    const today = todayAtZero()
    parsed.setHours(0, 0, 0, 0)

    if (parsed < today) {
      return { ok: false, reason: "Дата в прошлом." }
    }
    return { ok: true, parsed }
  }

  function validateTimeField() {
    if (!timeInput) return { ok: true }
    const raw = timeInput.value
    if (!raw) return { ok: false, reason: "Время не указано." }

    const m = raw.match(/^(\d{1,2}):(\d{2})$/)
    if (!m) return { ok: false, reason: "Неверный формат времени." }

    const hour = Number(m[1])
    const minute = Number(m[2])

    if (hour < 12) {
      return { ok: false, reason: "Ресторан открыт с 12:00." }
    }

    const dateValidation = validateDateField()
    if (dateValidation.ok && dateValidation.parsed) {
      const selectedDate = dateValidation.parsed
      const today = todayAtZero()
      if (selectedDate.getTime() === today.getTime()) {
        const now = new Date()
        const nowTotal = now.getHours() * 60 + now.getMinutes()
        const selTotal = hour * 60 + minute
        if (selTotal < nowTotal) {
          return { ok: false, reason: "Выбрано время, которое уже прошло сегодня." }
        }
      }
    }

    return { ok: true }
  }

  if (dateInput) {
    dateInput.addEventListener("change", () => {
      const r = validateDateField()
      if (!r.ok) {
        alert(r.reason)
        dateInput.value = ""
      }
    })
  }

  if (timeInput) {
    timeInput.addEventListener("change", () => {
      const r = validateTimeField()
      if (!r.ok) {
        alert(r.reason)
        timeInput.value = ""
      }
    })
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      const r1 = validateDateField()
      if (!r1.ok) {
        alert(r1.reason)
        e.preventDefault()
        return
      }

      const r2 = validateTimeField()
      if (!r2.ok) {
        alert(r2.reason)
        e.preventDefault()
        return
      }
    })
  }

  // Сброс формы
  function resetForm() {
    if (bookingForm) {
      bookingForm.reset()
      document.querySelectorAll(".error").forEach((el) => {
        el.style.display = "none"
      })
    }
  }
})
