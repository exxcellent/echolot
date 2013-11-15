package de.exxcellent.echolot.app;


import nextapp.echo.app.Border;
import nextapp.echo.app.Color;
import nextapp.echo.app.text.StringDocument;
import nextapp.echo.app.text.TextComponent;

/**
 * Base class for text components that can show visual hints when the text entered does not match a regular expression.
 * @author Daniel Diepold
 * @version 1.0
 */
public abstract class RegexComponent extends TextComponent {
    public static final String PROPERTY_REGEX = "regex";
    public static final String PROPERTY_REGEX_MISMATCH_BORDER = "regexMismatchBorder";
    public static final String PROPERTY_REGEX_MISMATCH_FOREGROUND = "regexMismatchForeground";

    public RegexComponent() {
        super(new StringDocument());
    }

    /**
     * @see #setRegex(String)
     * @return regular expression string
     */
    public String getRegex() {
        return (String) get(PROPERTY_REGEX);
    }

    /**
     * @see #setPropertyRegexMismatchBorder(nextapp.echo.app.Border)
     * @return
     */
    public Border getRegexMismatchBorder() {
        return (Border) get(PROPERTY_REGEX_MISMATCH_BORDER);
    }

    /**
     * @see #setPropertyRegexMismatchForeground(nextapp.echo.app.Color)
     * @return
     */
    public Color getRegexMismatchForeground() {
        return (Color) get(PROPERTY_REGEX_MISMATCH_FOREGROUND);
    }

    /**
     * Set a regular expression string that the text is validated against on the client side.
     * If the content does not match the expression, the component renders with the "REGEX_MISMATCH_*" properties
     * instead of the regular ones.
     *
     * The regular expression should be specified as String, e.g. "^\d*$" would match an arbitrary number of digits.
     * Make sure to escape backslashes if needed!
     *
     * @param regex JavaScript regular expression
     */
    public void setRegex(String regex) {
        set(PROPERTY_REGEX, regex);
    }

    /**
     * Border that should be rendered around the text component in case the specified regular expression {@link #setRegex(String)}
     * does not match the text.
     *
     * @param regexMismatchBorder border style to render
     */
    public void setPropertyRegexMismatchBorder(Border regexMismatchBorder) {
        set(PROPERTY_REGEX_MISMATCH_BORDER, regexMismatchBorder);
    }

    /**
     * Foreground color that should be used in case the specified regular expression {@link #setRegex(String)}
     * does not match the text.
     *
     * @param regexMismatchForeground foreground color to render
     */
    public void setPropertyRegexMismatchForeground(Color regexMismatchForeground) {
        set(PROPERTY_REGEX_MISMATCH_FOREGROUND, regexMismatchForeground);
    }
}
