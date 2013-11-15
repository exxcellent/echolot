package de.exxcellent.echolot.webcontainer.sync.component;

import de.exxcellent.echolot.app.RegexTextArea;

public class RegexTextAreaPeer extends RegexComponentPeer {
    @Override
    public String getClientComponentType(boolean shortType) {
        return "exxcellent.RegexTextArea";
    }

    @Override
    public Class getComponentClass() {
        return RegexTextArea.class;
    }
}
