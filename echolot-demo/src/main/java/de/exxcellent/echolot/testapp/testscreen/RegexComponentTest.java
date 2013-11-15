package de.exxcellent.echolot.testapp.testscreen;

import de.exxcellent.echolot.app.RegexTextArea;
import de.exxcellent.echolot.app.RegexTextField;
import de.exxcellent.echolot.app.SuggestField;
import de.exxcellent.echolot.testapp.ButtonColumn;
import de.exxcellent.echolot.testapp.StyleUtil;
import nextapp.echo.app.*;
import nextapp.echo.app.event.ActionEvent;
import nextapp.echo.app.event.ActionListener;

public class RegexComponentTest  extends SplitPane {
    private RegexTextField regexTextField;
    private RegexTextArea regexTextArea;
    private TextField regex;

    private ApplicationInstance active;

    public RegexComponentTest() {
        super(SplitPane.ORIENTATION_HORIZONTAL, new Extent(250, Extent.PX));
        setStyleName("DefaultResizable");

        ButtonColumn controlsColumn = new ButtonColumn();
        controlsColumn.setStyleName("TestControlsColumn");
        add(controlsColumn);
        Row r = new Row();

        regex = new TextField();
        regex.setText("^.{0,4}$");
        regex.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                regexTextField.setRegex(regex.getText());
                regexTextArea.setRegex(regex.getText());
            }
        });

        regexTextField = new RegexTextField();
        regexTextArea  = new RegexTextArea();

        regexTextField.setRegex("^.{0,4}$");
        regexTextArea.setRegex("^.{0,4}$");
        regexTextField.setBorder(new Border(1, Color.GREEN, Border.STYLE_SOLID));
        regexTextField.setPropertyRegexMismatchBorder(new Border(1, Color.RED, Border.STYLE_SOLID));
        regexTextArea.setPropertyRegexMismatchBorder(new Border(1, Color.RED, Border.STYLE_SOLID));

        regexTextArea.setText("This text is too long");
        regexTextField.setText("This text is too long");


        // -- Models ---


        controlsColumn.add(new Label("Appearance"));

        controlsColumn.addButton("Regex Mismatch - Random Border", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Border randomBorder = StyleUtil.randomBorder();
                regexTextField.setPropertyRegexMismatchBorder(randomBorder);
                regexTextArea.setPropertyRegexMismatchBorder(randomBorder);
            }
        });

        controlsColumn.addButton("Regex Mismatch - Random Foreground", new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Color randomFg = StyleUtil.randomColor();
                regexTextField.setPropertyRegexMismatchForeground(randomFg);
                regexTextArea.setPropertyRegexMismatchForeground(randomFg);
            }
        });

        Column rfields = new Column();
        rfields.add(regex);
        rfields.add(regexTextField);
        rfields.add(regexTextArea);
        add(rfields);
    }
}
