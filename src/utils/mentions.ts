import { EditorView, MatchDecorator, Decoration, ViewPlugin, WidgetType, ViewUpdate } from "@codemirror/view"
import { RangeSet } from "@codemirror/state"

const mentionMatcher = new MatchDecorator({
    regexp: /(\[(.+?)\])(\(@u(\d+)\))/g,
    decoration: match => Decoration.replace({
        // NOTE: can't use backspace to go "up one row" when inclusive is false
        inclusive: true,
        widget: new MentionWidget(match)
    })
})

class MentionWidget extends WidgetType {

    match: RegExpExecArray;

    constructor(match: RegExpExecArray) {
        super();
        this.match = match;
    }

    eq(other: MentionWidget) {
        return other.match[1] === this.match[1];
    }

    toDOM() {
        let wrap = document.createElement("span");
        wrap.className = "wy-mention";
        wrap.innerHTML = typeof (this.match[5]) !== "undefined" ? this.match[5] : this.match[2];
        return wrap
    }
    ignoreEvent() { return false }
}

export const mentions = ViewPlugin.fromClass(class {

    mentions: RangeSet<Decoration>;

    constructor(view: EditorView) {
        this.mentions = mentionMatcher.createDeco(view)
    }
    update(update: ViewUpdate) {
        this.mentions = mentionMatcher.updateDeco(update, this.mentions)
    }
}, {
    decorations: instance => instance.mentions,
    provide: plugin => EditorView.atomicRanges.of(view => {
        return view.plugin(plugin)?.mentions || Decoration.none
    })
})
