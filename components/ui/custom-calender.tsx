  <CustomCalendar
                          selectedDate={date}
                          onSelect={(selectedDate) => {
                            setDate(selectedDate)
                            setIsCalendarOpen(false)
                          }}
                        />