/*
 * This file (LocaleModel.java) is part of the Echolot Project (hereinafter "Echolot").
 * Copyright (C) 2008-2010 eXXcellent Solutions GmbH.
 *
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 */

package de.exxcellent.echolot.model;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import de.exxcellent.echolot.app.DatePicker;
import java.io.Serializable;

/**
 * The internationalization model object for use in the {@link DatePicker} component to influence the labels, dateformat
 * etc according to the regional settings of the described country.
 * 
 * @author Oliver Pehnke <o.pehnke@exxcellent.de>
 */
@XStreamAlias("localeModel")
public class LocaleModel implements Serializable {
	private static final long serialVersionUID = 32;
	
	/**
     * The German locale with a usual date format, e.g. '02.05.2004'
     */
	public static final LocaleModel GERMAN;
    static {
        GERMAN = new LocaleModel();
        GERMAN.setWeekText("KW");
        GERMAN.setPrevText("&lt;");
        GERMAN.setNextText("&gt;");
        GERMAN.setDayNames(new String[] { "Sonntag", "Montag", "Dienstag", "Mittwoch",
                                                 "Donnerstag", "Freitag", "Samstag" });
        GERMAN.setDayNamesShort(new String[] { "Sonntag", "Montag", "Dienstag", "Mittwoch",
                                                      "Donnerstag", "Freitag", "Samstag" });
        GERMAN.setDayNamesMin(new String[] { "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa" });
        GERMAN.setMonthNames(new String[] { "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
                "September", "Oktober", "November", "Dezember" });
        GERMAN.setMonthNamesShort(new String[] { "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt",
                "Nov", "Dez" });
        GERMAN.setFirstDay(1);
        GERMAN.setDateFormat("dd.MM.yyyy");
    }

	/**
     * An english default locale with a usual date format, e.g. '12-28-2004'
     */
	public static final LocaleModel ENGLISH;
    static {
        ENGLISH = new LocaleModel();
        ENGLISH.setWeekText("wk");
        ENGLISH.setPrevText("&lt;");
        ENGLISH.setNextText("&gt;");
        ENGLISH.setDayNames(new String[] { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" });
        ENGLISH.setDayNamesShort(new String[] { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" });
        ENGLISH.setDayNamesMin(new String[] { "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" });
        ENGLISH.setMonthNames(new String[] { "January", "February", "March", "April", "May", "June", "July", "August",
                "September", "October", "November", "December" });
        ENGLISH.setMonthNamesShort(new String[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
                "Nov", "Dez" });
        ENGLISH.setFirstDay(1);
        ENGLISH.setDateFormat("MM-dd-yyyy");
    }

    /** The prevText, should be the unicode right arrow: &#9664; */ // No good idea: some systems do not have a unicodide font installed!
     private String prevText = "&lt;";
    /** The nextText, should be the unicode left arrow: &#9654; */
    private String nextText = "&gt";
    /** The short name for the word "week", e.g. 'KW' */
    private String weekText;
    /** The monthNames, the full names of all month starting with January, e.g. "January" */
    private String[] monthNames;
    /** The monthNamesShort, the shorted names of all month starting with January, e.g. "Jan" */
    private String[] monthNamesShort;
    /** The dayNames, the full names of all days starting with Sunday, e.g. "Sunday" */
    private String[] dayNames;
    /** The dayNamesShort, the shorted names of all days starting with Sunday, e.g. "Sun" */
    private String[] dayNamesShort;
    /** The dayNamesMin, the minimalized names of all days starting with Sunday, e.g. "Su" */
    private String[] dayNamesMin;
    /** The dateFormat, @see {LocaleModel#setDateFormat(String)} */
    private String dateFormat;
    /** The firstDay, the first day of the week counting from 0 = Sunday */
    private int firstDay;


    /** Default constructor. */
	public LocaleModel() {
	}
	
    /**
     * The text to display for the previous month link.
     * 
     * @return The text to display for the previous month link.
     */
    public String getPrevText() {
        return prevText;
    }

    /**
     * The text to display for the previous month link. This attribute is one of the regionalisation attributes. With
     * the standard ThemeRoller styling, this value is replaced by an icon.
     * 
     * @param prevText The text to display for the previous month link.
     */
    public void setPrevText(final String prevText) {
        this.prevText = prevText;
    }

    /**
     * The text to display for the next month link.
     * 
     * @return The text to display for the next month link.
     */
    public String getNextText() {
        return nextText;
    }

    /**
     * The text to display for the next month link. This attribute is one of the regionalisation attributes. With the
     * standard ThemeRoller styling, this value is replaced by an icon.
     * 
     * @param nextText The text to display for the next month link.
     */
    public void setNextText(final String nextText) {
        this.nextText = nextText;
    }

    /**
     * @return The short week text to display for the year week.
     */
    public String getWeekText() {
        return weekText;
    }

    /**
     * The text to display for the week. This attribute is one of the regionalisation attributes.
     * 
     * @param weekText The text to display for the week (e.g. 'kw').
     */
    public void setWeekText(final String weekText) {
        this.weekText = weekText;
    }
    
    /**
     * The list of full month names.
     * 
     * @return The list of full month names.
     */
	public String[] getMonthNames() {
        return monthNames;
	}

    /**
     * The list of full month names, as used in the month header on each datepicker and as requested via the dateFormat
     * setting. This attribute is one of the regionalisation attributes. <br/>
     * Example
     * 
     * <pre>
     * new String[]{"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"}
     * </pre>
     * 
     * @param monthNames The list of full month names
     */
	public void setMonthNames(final String[] monthNames) {
        this.monthNames = monthNames;
	}
	/**
     * Accessor for property 'monthNamesShort'.
     * 
     * @return Value for property 'monthNamesShort'.
     */
    public String[] getMonthNamesShort() {
        return monthNamesShort;
    }

    /**
     * The list of abbreviated month names, for use as requested via the dateFormat setting. This attribute is one of
     * the regionalisation attributes. <br/>
     * Example
     * 
     * <pre>
     * new String[]{"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"}
     * </pre>
     * 
     * @param monthNamesShort Value to set for property 'monthNamesShort'.
     */
    public void setMonthNamesShort(final String[] monthNamesShort) {
        this.monthNamesShort = monthNamesShort;
    }

    /**
     * The list of long day names, starting from Sunday.
     * 
     * @return The list of long day names, starting from Sunday
     */
    public String[] getDayNames() {
        return dayNames;
    }

    /**
     * The list of long day names, starting from Sunday, for use as requested via the dateFormat setting. They also
     * appear as popup hints when hovering over the corresponding column headings. This attribute is one of the
     * regionalisation attributes. <br/>
     * Example
     * 
     * <pre>
     * new String[]{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}
     * </pre>
     * 
     * @param dayNames The list of long day names, starting from Sunday
     */
    public void setDayNames(final String[] dayNames) {
        this.dayNames = dayNames;
    }

    /**
     * The list of abbreviated day names, starting from Sunday.
     * 
     * @return The list of abbreviated day names, starting from Sunday
     */
    public String[] getDayNamesShort() {
        return dayNamesShort;
    }

    /**
     * The list of abbreviated day names, starting from Sunday, for use as requested via the dateFormat setting. This
     * attribute is one of the regionalisation attributes. <br/>
     * Example
     * 
     * <pre>
     * new String[]{"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}
     * </pre>
     * 
     * @param dayNamesShort The list of abbreviated day names, starting from Sunday
     */
    public void setDayNamesShort(final String[] dayNamesShort) {
        this.dayNamesShort = dayNamesShort;
    }

    /**
     * The list of minimised day names, starting from Sunday.
     * 
     * @return The list of minimised day names, starting from Sunday
     */
    public String[] getDayNamesMin() {
        return dayNamesMin;
    }

    /**
     * The list of minimized day names, starting from Sunday, for use as column headers within the datepicker. This
     * attribute is one of the regionalisation attributes. <br/>
     * Example
     * 
     * <pre>
     * new String[]{"Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"}
     * </pre>
     * 
     * @param dayNamesMin The list of minimised day names, starting from Sunday
     */
    public void setDayNamesMin(final String[] dayNamesMin) {
        this.dayNamesMin = dayNamesMin;
    }

    /**
     * Accessor for property 'dateFormat'. The format for parsed and displayed dates. The format is implemented on the
     * client side code.
     * 
     * @return The format for parsed and displayed dates.
     */
    public String getDateFormat() {
        return dateFormat;
    }

    /**
     * The format for parsed and displayed dates. This attribute is one of the regionalisation attributes. For a full
     * list of the possible formats see the formatDate function in client side code.
     * <p>
     * <b>Rules for valid dateFormat:</b><br/>
     * <ul>
     * <li>dd == day of month with leading zero, e.g. "01"</li>
     * <li>d == day of month without leading zero, e.g. "1"</li>
     * <li>MM == month of year with leading zero, e.g. "08"</li>
     * <li>M == month of year without leading zero, e.g. "8"</li>
     * <li>YYYY == year with 4 digits, e.g. "2010"</li>
     * <li>YY == year with 2 digits, e.g. "10"</li>
     * </ul>
     * </p>
     * <p>
     * <b>Examples:</b><br/>
     * <ul>
     * <li>"dd.MM.YYYY" => 10.02.2009</li>
     * <li>"YY/dd/MM" => 09/10/02</li>
     * </ul>
     * 
     * @param dateFormat Value to set for property 'dateFormat'.
     */
    public void setDateFormat(final String dateFormat) {
        this.dateFormat = dateFormat;
    }
    
    /**
     * Set the first day of the week. Sunday is 0, Monday is 1, ...
     * 
     * @return Set the first day of the week
     */
    public int getFirstDay() {
        return firstDay;
    }

    /**
     * Set the first day of the week: Sunday is 0, Monday is 1, ... This attribute is one of the regionalisation
     * attributes.
     * 
     * @param firstDay Set the first day of the week.
     */
    public void setFirstDay(final int firstDay) {
        this.firstDay = firstDay;
    }

    /** @inheritDoc */
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + firstDay;
        result = prime * result + ((nextText == null) ? 0 : nextText.hashCode());
        return result;
    }

    /** @inheritDoc */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        LocaleModel other = (LocaleModel) obj;
        if (firstDay != other.firstDay) {
            return false;
        }
        if (nextText == null) {
            if (other.nextText != null) {
                return false;
            }
        } else if (!nextText.equals(other.nextText)) {
            return false;
        }
        return true;
    }
}
