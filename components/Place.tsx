export default function Place({ name }: { name: string }) {
    return (
        <fieldset class="place">
            <legend>{name}</legend>
            <label class="positive">
                Positive
                <input type="radio" name={name} value="positive" />
            </label>
            <label class="neutral">
                Neutral
                <input type="radio" name={name} value="neutral" checked />
            </label>
            <label class="negative">
                Negative
                <input type="radio" name={name} value="negative" />
            </label>
        </fieldset>
    );
}
