export default function Place({ name }: { name: string }) {
    const field_name = `preference-${name}`;

    return (
        <fieldset class="place">
            <legend>{name}</legend>
            <label class="positive">
                Positive
                <input type="radio" name={field_name} value="positive" />
            </label>
            <label class="neutral">
                Neutral
                <input type="radio" name={field_name} value="neutral" />
            </label>
            <label class="negative">
                Negative
                <input type="radio" name={field_name} value="negative" />
            </label>
        </fieldset>
    );
}
