package de.exxcellent.echolot.webcontainer.sync.component;

import de.exxcellent.echolot.app.RegexTextField;

public class RegexTextFieldPeer extends RegexComponentPeer {
    @Override
    public String getClientComponentType(boolean shortType) {
        return "exxcellent.RegexTextField";
    }

    @Override
    public Class getComponentClass() {
        return RegexTextField.class;
    }
}
