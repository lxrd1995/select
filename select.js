const getTemplate = (data = [], placeholder, selectedId) => {
	let text = placeholder ?? "Placeholder";
	const items = data.map(item => {

		if (item.id === selectedId) {
			text = item.value;
		}
		return `<li class="select__item" data-select-type="item" data-select-id="${item.id}">${item.value}</li > `;
	})
	return `
		<div class="select__header" data-select-type="header" >
			<span data-select-type="value">${text}</span>
			<div class="select__arrow" data-select-type="arrow">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
					<path
						d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z" />
				</svg>
			</div>
		</ div>
		<div data-select-type="body" class="select__body">
			<ul class="select__list">
				${items.join('')}
			</ul>
		</div>
	`
}

export class Select {
	constructor(selector, options) {
		this.$el = document.querySelector(selector);
		this.options = options;
		this.selectedId = this.options.selectedId;
		this.selectPerView = this.options.selectPerView;

		this.#render();
		this.#setup();
	}

	#render() {
		const { data, placeholder } = this.options;
		this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId);
	}

	#setup() {
		this.clickHandler = this.clickHandler.bind(this);
		this.$el.addEventListener("click", this.clickHandler);
		this.$value = this.$el.querySelector('[data-select-type="value"]');

		this.$item = this.$el.querySelector('[data-select-type="item"]');
		this.$body = this.$el.querySelector('[data-select-type="body"]');

		if (this.selectPerView === "all") {
			this.$body.style.maxHeight = `${this.$item.offsetHeight * this.options.data.length}px`;

		}
	}

	clickHandler(event) {
		const { selectType } = event.target.dataset;

		if (selectType === "header" || selectType === "arrow") {
			this.toggle();
		} else if (selectType === "item") {
			const id = event.target.dataset.selectId;
			this.select(id);
		}
	}

	get isOpen() {
		return this.$el.classList.contains("_open");
	}

	get current() {
		return this.options.data.find(item => item.id === this.selectedId);
	}

	select(id) {
		this.selectedId = id;
		this.$value.textContent = this.current.value;
		this.close();
	}

	toggle() {
		this.isOpen ? this.close() : this.open();
	}

	open() {
		this.$el.classList.add("_open");
	}

	close() {
		this.$el.classList.remove("_open");
	}

	destroy() {
		this.$el.removeEventListener("click", this.clickHandler);
		this.$el.innerHTML = '';
	}
}