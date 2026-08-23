package com.keeponme.domain.goal;

public enum WeekDay {
    MON, TUE, WED, THU, FRI, SAT, SUN;

    public static WeekDay from(java.time.DayOfWeek javaDayOfWeek) {
        return values()[javaDayOfWeek.getValue() - 1];
    }

    public java.time.DayOfWeek toJavaDayOfWeek() {
        return java.time.DayOfWeek.of(this.ordinal() + 1);
    }
}
